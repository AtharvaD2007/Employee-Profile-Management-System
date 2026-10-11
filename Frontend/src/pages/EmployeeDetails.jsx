import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

function EmployeeDetails() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Employee not found"
        );
      }
    };

    loadEmployee();
  }, [id]);

  if (!employee) {
    return <div className="page">{message || "Loading..."}</div>;
  }

  const photo = employee.photoPath
    ? `${import.meta.env.VITE_API_URL}${employee.photoPath}`
    : null;

  return (
    <div className="page">
      <div className="card">
        <h2>Employee Details</h2>

        {photo && (
          <img
            src={photo}
            alt="Profile"
            className="profile-image"
          />
        )}

        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Designation:</strong> {employee.designation}</p>
        <p><strong>Role:</strong> {employee.role}</p>
        <p>
          <strong>Status:</strong>{" "}
          {employee.active ? "Active" : "Inactive"}
        </p>

        <Link
          className="button"
          to={`/employees/${employee._id}/edit`}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

export default EmployeeDetails;