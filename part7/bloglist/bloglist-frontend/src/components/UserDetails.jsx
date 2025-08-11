import { useState, useEffect } from "react";
import usersService from "../services/users";
import { useParams } from "react-router-dom";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    usersService.getById(id).then((data) => {
      setUser(data);
    });
  }, [id]);

  if (!user) {
    return <div>loading user...</div>;
  }

  console.log(user);
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs && user.blogs.length > 0 ? (
          user.blogs.map((blog) => <li key={blog.id}>{blog.title}</li>)
        ) : (
          <li>No blogs added by this user.</li>
        )}
      </ul>
    </div>
  );
};

export default UserDetails;
