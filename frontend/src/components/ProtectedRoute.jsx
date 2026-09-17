import { Navigate } from "react-router-dom";
import { useApp } from "../context";

export function ProtectedRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/account" replace />;
  return children;
}
