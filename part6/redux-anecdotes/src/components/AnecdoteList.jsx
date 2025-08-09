import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
  const filter = state.filter.toLowerCase()
  return [...state.anecdotes]
    .filter(a => a.content.toLowerCase().includes(filter))
    .sort((a, b) => b.votes - a.votes)
  })

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    // setN(`You voted ${anecdote.content}`)
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  // const setN = (content) => {
  //   dispatch(setNotification(content))
  //   setTimeout(() => {
  //     dispatch(clearNotification()) 
  //   }, 5000)
  // }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList