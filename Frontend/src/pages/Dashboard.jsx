import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load employees"
      );
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const deactivate = async (id) => {
    if (!window.confirm("Deactivate this employee?")) return;

    try {
      await api.patch(`/employees/${id}/deactivate`);
      loadEmployees();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Action failed"
      );
    }
  };

  return (
    <div className="container">
      <div className="header-row">
        <h2>HR Dashboard</h2>
        <Link className="button" to="/employees/add">
          Add Employee
        </Link>
      </div>

      {message && <p className="error">{message}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.designation}</td>
                <td>{employee.role}</td>
                <td>
                  {employee.active ? "Active" : "Inactive"}
                </td>

                <td>
                  <Link to={`/employees/${employee._id}`}>
                    View
                  </Link>{" "}

                  <Link to={`/employees/${employee._id}/edit`}>
                    Edit
                  </Link>{" "}

                  {employee.active && (
                    <button
                      className="danger"
                      onClick={() => deactivate(employee._id)}
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;