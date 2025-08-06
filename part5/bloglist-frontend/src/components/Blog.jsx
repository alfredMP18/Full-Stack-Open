import { useState } from 'react'

const Blog = ({ blog, changeBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showRemoveButton = blog.user && user && blog.user.username === user.username
  console.log('Blog user:', blog.user)
  return (
    <div style={blogStyle} className="blog">
      <div className="blog-default" data-testid="blog-item">
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blog-details" data-testid="blog-details">
          <p>{blog.url}</p>
          <div data-testid="likes-count">likes {blog.likes} <button onClick = {() => changeBlog(blog)}>like</button></div>
          {showRemoveButton && (
            <p><button data-testid="blogRemove-button" onClick={() => deleteBlog(blog)}>remove</button></p>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
