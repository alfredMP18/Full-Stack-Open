import { createSlice } from "@reduxjs/toolkit";

const initialState = { message: null, type: null };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setN(state, action) {
      return {
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    clearNotification() {
      return initialState;
    },
  },
});

export const { setN, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

export const setNotification = (content, type, time) => {
  return async (dispatch) => {
    dispatch(setN({ message: content, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
  };
};
