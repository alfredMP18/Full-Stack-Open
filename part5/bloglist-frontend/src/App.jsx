import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const blogFormRef = useRef()
  const blogViewRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Notification = ({ message, type }) => {
    if (message === null) return null

    return (
      <div className={type}>
        {message}
      </div>
    )
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setSuccessMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        blogFormRef.current.toggleVisibility()
      })
      .catch(error => {
        setErrorMessage('Blog addition failed')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        console.log(error.response.data.error)
      })
  }


  const deleteBlog = (blogObject) => {
    const confirm = window.confirm(`Remove blog "${blogObject.title}" by ${blogObject.author}?`)
    if (!confirm) return

    blogService
      .deleteObject(blogObject.id)
      .then(response => {
        setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
        setSuccessMessage(`You deleted "${blogObject.title}"`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage('Failed to delete the blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        console.log(error.response.data.error)
      })
  }

  const changeBlog = (blogToUpdate) => {
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }

    blogService
      .update(updatedBlog.id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== blogToUpdate.id ? blog : returnedBlog))
        setSuccessMessage(`You liked "${returnedBlog.title}"`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage('Failed to like the blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        console.log(error.response.data.error)
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
            username
          <input
            type="text"
            value={username}
            name="Username"
            data-testid="username-input"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
            password
          <input
            type="password"
            value={password}
            name="Password"
            data-testid="password-input"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button data-testid="login-button" type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <p><p>{user.name} logged in</p></p>
      <button onClick={handleLogout}>logout</button>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} changeBlog={changeBlog} deleteBlog={deleteBlog} user={user} />
        )}

    </div>
  )


  return (
    <div>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
      {user === null
        ? loginForm()
        : blogForm()
      }
    </div>
  )

}

export default App