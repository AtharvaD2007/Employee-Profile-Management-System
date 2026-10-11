import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    role: "EMPLOYEE",
    active: true,
  });

  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      const response = await api.get(`/employees/${id}`);

      setForm({
        name: response.data.name || "",
        email: response.data.email || "",
        password: "",
        department: response.data.department || "",
        designation: response.data.designation || "",
        role: response.data.role || "EMPLOYEE",
        active: response.data.active,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load employee"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("email", form.email);
      data.append("department", form.department);
      data.append("designation", form.designation);

      if (!isEdit || form.password) {
        data.append("password", form.password);
      }

      if (role === "HR") {
        data.append("role", form.role);
        data.append("active", form.active);
      }

      if (photo) {
        data.append("photo", photo);
      }

      if (isEdit) {
        await api.patch(`/employees/${id}`, data);
        navigate(`/employees/${id}`);
      } else {
        await api.post("/employees", data);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">

      <div className="form-header">
        <div>
          <h1>
            {isEdit ? "Edit Employee" : "Add Employee"}
          </h1>

          <p>
            {isEdit
              ? "Update employee information"
              : "Enter the employee's information below"}
          </p>
        </div>
      </div>

      <div className="form-card">

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-grid">

              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isEdit && (
                <div className="form-group">
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Department</label>

                <input
                  type="text"
                  name="department"
                  placeholder="e.g. IT"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Designation</label>

                <input
                  type="text"
                  name="designation"
                  placeholder="e.g. Software Developer"
                  value={form.designation}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          </div>

          {role === "HR" && (
            <div className="form-section">

              <h2>Account Settings</h2>

              <div className="form-grid">

                <div className="form-group">
                  <label>Role</label>

                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="EMPLOYEE">
                      Employee
                    </option>

                    <option value="HR">
                      HR
                    </option>
                  </select>
                </div>

                {isEdit && (
                  <div className="form-group checkbox-group">

                    <label>Status</label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="active"
                        checked={form.active}
                        onChange={handleChange}
                      />

                      <span>
                        Account is active
                      </span>
                    </label>

                  </div>
                )}

              </div>

            </div>
          )}

          <div className="form-section">

            <h2>Profile Photo</h2>

            <div className="photo-upload">

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) =>
                  setPhoto(e.target.files[0])
                }
              />

              <small>
                JPG, PNG or WEBP. Maximum size: 2MB.
              </small>

            </div>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate(
                  isEdit
                    ? `/employees/${id}`
                    : "/dashboard"
                )
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Add Employee"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}

export default EmployeeForm;