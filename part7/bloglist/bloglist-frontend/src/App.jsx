import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import UsersList from "./components/UsersList";
import BlogDetails from "./components/BlogDetails";
import Menu from "./components/Menu";
import "./index.css";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import UserDetails from "./components/UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  removeBlog,
} from "./reducers/blogReducer";
import {
  initializeUser,
  setUser,
  clearUser,
} from "./reducers/loggedUserReducer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import styled from "styled-components";

const AppContainer = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fefefe;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    color: #2c3e50;
    font-weight: 700;
  }
`;

const ContentContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: inset 0 0 10px #eee;
`;

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 5px 15px rgb(0 0 0 / 0.2);

  h2 {
    margin-bottom: 1.5rem;
    text-align: center;
    color: #2c3e50;
  }

  form > div {
    margin-bottom: 1rem;
  }

  input {
    width: 100%;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button {
    width: 100%;
    background-color: #007bff;
    border: none;
    padding: 10px;
    color: white;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const App = () => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState(null);
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [successMessage, setSuccessMessage] = useState(null);
  const blogFormRef = useRef();
  const blogViewRef = useRef();
  const dispatch = useDispatch();

  const blogs = useSelector((state) => state.blog);
  const user = useSelector((state) => state.loggedUser);

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUser());
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("Wrong username or password", "error", 5));
    }
  };

  const handleLogout = async (event) => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(clearUser());
  };

  const loginForm = () => (
    <LoginContainer>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            data-testid="username-input"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            data-testid="password-input"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button data-testid="login-button" type="submit">
          login
        </button>
      </form>
    </LoginContainer>
  );

  if (!user) {
    return (
      <div>
        <Notification />
        {loginForm()}
      </div>
    );
  }

  // useEffect(() => {
  //   const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
  //   if (loggedUserJSON) {
  //     const user = JSON.parse(loggedUserJSON);
  //     setUser(user);
  //     blogService.setToken(user.token);
  //   }
  // }, []);

  const addBlog = (blogObject) => {
    // blogService
    //   .create(blogObject)
    //   .then((returnedBlog) => {
    //     setBlogs(blogs.concat(returnedBlog));
    //     dispatch(
    //       setNotification(
    //         `a new blog ${blogObject.title} by ${blogObject.author} added`,
    //         "success",
    //         5,
    //       ),
    //     );
    //     setNewTitle("");
    //     setNewAuthor("");
    //     setNewUrl("");
    //     blogFormRef.current.toggleVisibility();
    //   })
    //   .catch((error) => {
    //     dispatch(setNotification("Blog addition failed", "error", 5));
    //     console.log(error.response.data.error);
    //   });

    dispatch(createBlog(blogObject));
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
    blogFormRef.current.toggleVisibility();
  };

  const deleteBlog = (blogObject) => {
    const confirm = window.confirm(
      `Remove blog "${blogObject.title}" by ${blogObject.author}?`,
    );
    if (!confirm) return;

    // blogService
    //   .deleteObject(blogObject.id)
    //   .then((response) => {
    //     setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));
    //     // setSuccessMessage(`You deleted "${blogObject.title}"`);
    //     // setTimeout(() => {
    //     //   setSuccessMessage(null);
    //     // }, 5000);
    //   })
    //   .catch((error) => {
    //     // setErrorMessage("Failed to delete the blog");
    //     // setTimeout(() => {
    //     //   setErrorMessage(null);
    //     // }, 5000);
    //     console.log(error.response.data.error);
    //   });
    dispatch(removeBlog(blogObject));
  };

  const changeBlog = (blogToUpdate) => {
    // blogService
    //   .update(updatedBlog.id, updatedBlog)
    //   .then((returnedBlog) => {
    //     setBlogs(
    //       blogs.map((blog) =>
    //         blog.id !== blogToUpdate.id ? blog : returnedBlog,
    //       ),
    //     );
    //     // setSuccessMessage(`You liked "${returnedBlog.title}"`);
    //     // setTimeout(() => {
    //     //   setSuccessMessage(null);
    //     // }, 5000);
    //   })
    //   .catch((error) => {
    //     // setErrorMessage("Failed to like the blog");
    //     // setTimeout(() => {
    //     //   setErrorMessage(null);
    //     // }, 5000);
    //     console.log(error.response.data.error);
    //   });
    dispatch(likeBlog(blogToUpdate));
  };

  const blogForm = () => (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            changeBlog={changeBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        ))}
    </div>
  );

  return (
    <AppContainer>
      <Menu user={user} logout={handleLogout} />

      <ContentContainer>
        <Header>
          <h1>Blog App</h1>
        </Header>
        <Notification />
        <Routes>
          <Route path="/" element={blogForm()} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route
            path="/blogs/:id"
            element={<BlogDetails changeBlog={changeBlog} />}
          />
        </Routes>
      </ContentContainer>
    </AppContainer>
  );
};

export default App;
