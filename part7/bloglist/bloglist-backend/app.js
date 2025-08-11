const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const cors = require("cors");
const Blog = require("./models/blog");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("./models/user");
const loginRouter = require("./controllers/login");
const tokenExtractor = require("./middleware/tokenExtractor");
const userExtractor = require("./middleware/userExtractor");

const app = express();
app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

app.get("/api/blogs", async (request, response) => {
  //add the user data into the blogs with populate
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

app.get("/api/blogs/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blog);
});

app.post("/api/blogs", userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "title and url are required" });
  }

  //tokenExtractor extract token and UserExtractor validates token and extract user
  const user = request.user;

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const populatedBlog = await savedBlog.populate("user", {
    username: 1,
    name: 1,
  });
  response.status(201).json(populatedBlog);
});

app.post("/api/blogs/:id/comments", async (request, response) => {
  const comment = request.body.comment;
  if (!comment) {
    return response.status(400).json({ error: "Comment is required" });
  }
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  blog.comments = blog.comments || [];
  blog.comments = blog.comments.concat(comment);
  const updatedBlog = await blog.save();

  response.status(201).json(updatedBlog);
});

app.delete("/api/blogs/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(403)
      .json({ error: "unauthorized to delete this blog" });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

app.put("/api/blogs/:id", async (request, response) => {
  const { title, author, url, likes, user } = request.body;

  const blogToUpdate = {
    title,
    author,
    url,
    likes,
    user: typeof user === "object" ? user.id : user,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blogToUpdate,
    { new: true, runValidators: true, context: "query" }
  );

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || username.length < 3) {
    return response.status(400).json({
      error: "username is required and must be at least 3 characters long",
    });
  }

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: "password is required and must be at least 3 characters long",
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: "username must be unique" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });

  response.json(user);
});

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

const testingRouter = require("./controllers/testing");
app.use("/api/testing", testingRouter);

module.exports = app;
