import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setNotification } from "./notificationReducer";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    updateBlog(state, action) {
      const updated = action.payload;
      return state.map((blog) => (blog.id === updated.id ? updated : blog));
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

export const { updateBlog, appendBlog, setBlogs, deleteBlog } =
  blogsSlice.actions;

//action creators that comunicates with the backend

export const initializeBlogs = () => {
  //initialize the state of frontend and the db of backend
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(content);
      dispatch(appendBlog(newBlog));
      dispatch(
        setNotification(
          `a new blog ${content.title} by ${content.author} added`,
          "success",
          5,
        ),
      );
    } catch (error) {
      dispatch(setNotification("Blog addition failed", "error", 5));
      console.log(error.response.data.error);
    }
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      };
      const response = await blogService.update(blog.id, updatedBlog);
      dispatch(updateBlog(response));
      dispatch(
        setNotification(`You liked "${updatedBlog.title}"`, "success", 5),
      );
    } catch (error) {
      dispatch(setNotification("Blog like failed", "error", 5));
      console.log(error.response.data.error);
    }
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.deleteObject(blog.id);
      dispatch(deleteBlog(blog.id));
      dispatch(setNotification(`You removed "${blog.title}"`, "success", 5));
    } catch (error) {
      dispatch(setNotification("Blog remove failed", "error", 5));
      console.log(error.response?.data?.error || error);
    }
  };
};

export default blogsSlice.reducer;
