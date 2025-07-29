import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with: <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({
  newPerson,
  handleNameChange,
  handleNumberChange,
  addPerson
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newPerson.name} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newPerson.number} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, handleDelete }) => (
  <>
    {persons.map(person => (
      <p key={person.id}>{person.name} {person.number}
      <button onClick={() => handleDelete(person.id, person.name)}>delete</button></p>
    ))}
  </>
)

const Notification = ({ message, type }) => {
  if (message === null) return null

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [filter, setFilter] = useState('')
  const [successMessage, setsuccessMessage] = useState(null)
  const [errorMessage, seterrorMessage] = useState(null)

  const handleNameChange = (event) => {
    setNewPerson({ ...newPerson, name: event.target.value })
  }

  const handleNumberChange = (event) => {
    setNewPerson({ ...newPerson, number: event.target.value })
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newPerson.name)

    if (existingPerson) {
      if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newPerson.number }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ))
            setNewPerson({ name: '', number: '' })

            setsuccessMessage(`Updated '${newPerson.name}'`)
             setTimeout(() => {
                setsuccessMessage(null)
              }, 5000)
          })
          .catch(error => {
            seterrorMessage(`Information of '${newPerson.name}' has already been removed from server`)
            setPersons(persons.filter(person => person.id !== existingPerson.id))                      
            setTimeout(() => {
              seterrorMessage(null)
            }, 5000)
          })
      }
      return // salir para no ejecutar la creación abajo
    }

    const personObject = {
      name: newPerson.name,
      number: newPerson.number
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewPerson({ name: '', number: '' })
        setsuccessMessage(`Added '${newPerson.name}'`)
        setTimeout(() => {
          setsuccessMessage(null)
        }, 5000)
      })
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          seterrorMessage(`Information of '${name}' has already been removed from server`)
        setTimeout(() => {
          seterrorMessage(null)
        }, 5000)

        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>

     <Notification message={successMessage} type="success" />
     <Notification message={errorMessage} type="error" />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        newPerson={newPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} handleDelete={handleDelete} />

    </div>
  )
}

export default App
