import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogReducer from "./reducers/blogReducer";
import LoggedUserReducer from "./reducers/loggedUserReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blog: blogReducer,
    loggedUser: LoggedUserReducer,
  },
  devTools: true,
});

export default store;
