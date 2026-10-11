import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Profile() {
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState("");

  const id = localStorage.getItem("employeeId");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Failed to load profile"
        );
      }
    };

    loadProfile();
  }, [id]);

  if (!employee) {
    return (
      <div className="page">
        <p>{message || "Loading..."}</p>
      </div>
    );
  }

  const photo = employee.photoPath
    ? `${import.meta.env.VITE_API_URL}${employee.photoPath}`
    : null;

  return (
    <div className="page">
      <div className="card profile">
        <h2>My Profile</h2>

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
          Edit Profile
        </Link>
      </div>
    </div>
  );
}

export default Profile;