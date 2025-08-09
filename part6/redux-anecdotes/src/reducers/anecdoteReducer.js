import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

//action creators
// export const createAnecdote = (content) => {
//   return {
//     type: 'NEW_ANECDOTE',
//     payload: {
//       content,
//       id: getId()
//     }
//   }
// }

// export const voteAnecdote = (id) => {
//   return {
//     type: 'VOTE',
//     payload: id
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)

// //payload has the data included in the action
// const reducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)

//   switch (action.type) {
//     case 'VOTE':
//       return state.map(anecdote =>
//         anecdote.id === action.payload
//           ? { ...anecdote, votes: anecdote.votes + 1 }
//           : anecdote
//       )
//     case 'NEW_ANECDOTE': {
//       const newAnecdote = {
//         content: action.payload.content,
//         id: action.payload.id,
//         votes: 0
//       }
//       return [...state, newAnecdote]
//     }
//     default:
//       return state
//   }
// }

// export default reducer
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // createAnecdote(state, action) {
    //   state.push(action.payload)
    // },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(anecdote => anecdote.id === updated.id ? updated : anecdote)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  }
})

export const { updateAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

//action creators that comunicates with the backend (Redux Thunk):

export const initializeAnecdotes = () => {
  //initialize the state of frontend and the db of backend
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const response = await anecdoteService.update(anecdote.id, updatedAnecdote)
    dispatch(updateAnecdote(response))
  }
}

export default anecdoteSlice.reducer