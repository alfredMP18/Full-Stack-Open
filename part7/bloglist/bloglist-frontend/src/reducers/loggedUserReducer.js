import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const loggedUserSlice = createSlice({
  name: "loggedUser",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = loggedUserSlice.actions;

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  };
};

export default loggedUserSlice.reducer;
