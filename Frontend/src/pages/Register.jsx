import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <div className="auth-brand">
          <div className="brand-icon"></div>
          <span>EmployeeHub</span>
        </div>

        <div className="auth-content">
          <p className="eyebrow">JOIN THE TEAM</p>

          <h1>
            Create your
            <br />
            <span>employee profile.</span>
          </h1>

          <p>
            Register your employee account and manage
            your professional information from one place.
          </p>
        </div>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-heading">
            <h2>Create account</h2>
            <p>Enter your employee information</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>

            <input
              name="name"
              placeholder="Atharva Dalvi"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email Address</label>

            <input
              name="email"
              type="email"
              placeholder="atharva@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>

            <input
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />

            <label>Department</label>

            <input
              name="department"
              placeholder="IT"
              value={form.department}
              onChange={handleChange}
              required
            />

            <label>Designation</label>

            <input
              name="designation"
              placeholder="Software Developer"
              value={form.designation}
              onChange={handleChange}
              required
            />

            <button
              className="auth-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>

          <div className="auth-footer">
            Already registered?{" "}
            <Link to="/login">Sign in</Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;