import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>Employee Management</h2>

      {token && (
        <div>
          {role === "HR" && (
            <Link to="/dashboard">Dashboard</Link>
          )}

          <Link to="/profile">Profile</Link>

          {role === "HR" && (
            <Link to="/employees/add">Add Employee</Link>
          )}

          <button onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;