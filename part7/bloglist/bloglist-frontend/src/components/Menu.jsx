import { useState } from "react";
import { Link } from "react-router-dom";

const Menu = ({ user, logout }) => {
  return (
    <div
      style={{ backgroundColor: "#45ff17ff" }}
      className="mb-2 d-flex align-items-center gap-3"
    >
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      <p className="mb-0">{user.name} logged in</p>
      <button onClick={logout} className="btn btn-outline-primary btn-sm">
        logout
      </button>
    </div>
  );
};

export default Menu;
