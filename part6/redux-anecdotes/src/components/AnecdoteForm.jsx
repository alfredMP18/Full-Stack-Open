import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    // const newAnecdote = await anecdoteService.createNew(content)
    // dispatch(createAnecdote(newAnecdote))
    dispatch(createAnecdote(content))
    // setN(`You created ${content}`)
    dispatch(setNotification(`you created '${content}'`, 5))
  }

  // const setN = (content) => {
  //   dispatch(setNotification(content))
  //   setTimeout(() => {
  //     dispatch(clearNotification()) 
  //   }, 5000)
  // }

  return (
    <form onSubmit={addAnecdote}>
      <h2>create new</h2>
      <div><input name="anecdote" /></div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
