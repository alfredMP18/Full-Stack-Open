import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'Welcome to the anecdotes app!', 
  reducers: {
    setN(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { setN, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
  //   dispatch(setNotification(content))
  //   setTimeout(() => {
  //     dispatch(clearNotification()) 
  //   }, 5000)
export const setNotification = (content, time) => {
  return async dispatch => {
    dispatch(setN(content))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time*1000)
  }
}