import { useState } from "react";
import { Link } from "react-router-dom";

const Blog = ({ blog, changeBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
  };

  const showRemoveButton =
    blog.user && user && blog.user.username === user.username;

  return (
    <div style={blogStyle} className="blog shadow-sm">
      <div
        className="d-flex justify-content-between align-items-center"
        data-testid="blog-item"
      >
        <Link to={`/blogs/${blog.id}`} className="text-decoration-none fw-bold">
          {blog.title} by {blog.author}
        </Link>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setVisible(!visible)}
        >
          {visible ? "hide" : "view"}
        </button>
      </div>

      {visible && (
        <div className="blog-details mt-3" data-testid="blog-details">
          <p>
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              {blog.url}
            </a>
          </p>
          <div
            data-testid="likes-count"
            className="d-flex align-items-center gap-2 mb-2"
          >
            <span>likes {blog.likes}</span>
            <button
              className="btn btn-sm btn-success"
              onClick={() => changeBlog(blog)}
            >
              like
            </button>
          </div>
          {showRemoveButton && (
            <button
              className="btn btn-sm btn-danger"
              data-testid="blogRemove-button"
              onClick={() => deleteBlog(blog)}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
