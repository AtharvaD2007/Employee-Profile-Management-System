import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, hrOnly = false }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (hrOnly && role !== "HR") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default ProtectedRoute;