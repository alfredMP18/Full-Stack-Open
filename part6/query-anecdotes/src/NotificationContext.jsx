import { createContext, useReducer, useContext } from 'react'
//state of the notification

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispach = useContext(NotificationContext)
  return notificationAndDispach[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispach = useContext(NotificationContext)
  return notificationAndDispach[1]
}

export default NotificationContext
