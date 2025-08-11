import { useState, useEffect } from "react";
import blogService from "../services/blogs";
import { useParams } from "react-router-dom";

const BlogDetails = ({ changeBlog }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    blogService.getById(id).then((data) => {
      setBlog(data);
    });
  }, [id]);

  if (!blog) {
    return <div>loading blog...</div>;
  }

  const handleLike = async () => {
    changeBlog(blog);
    setBlog({ ...blog, likes: blog.likes + 1 });
  };

  const onChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedBlog = await blogService.addComment(blog.id, comment);
      setBlog(updatedBlog);
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  console.log(blog.comments);

  return (
    <div>
      <div>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <div className="d-flex align-items-center gap-1">
          <p className="mb-0">{blog.likes} likes</p>
          <button onClick={handleLike}>like</button>
        </div>
        <p>added by {blog.author} </p>
      </div>

      <div>
        <h3>comments</h3>
        <form onSubmit={handleSubmit}>
          <input name="comment" value={comment} onChange={onChange}></input>
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))
          ) : (
            <p>No comments</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BlogDetails;
