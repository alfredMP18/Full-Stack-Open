import { useState, useEffect } from "react";
import usersService from "../services/users";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    usersService.getAll().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Users</h2>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ cursor: "pointer" }}>
              <td>
                <Link to={`/users/${user.id}`} className="text-decoration-none">
                  {user.name}
                </Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
