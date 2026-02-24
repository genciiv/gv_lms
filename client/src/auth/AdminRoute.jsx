import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthed, isAdmin, booting } = useAuth();

  if (booting) {
    return (
      <div className="container" style={{ padding: 24 }}>
        <div className="card">Loading...</div>
      </div>
    );
  }

  if (!isAuthed) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}