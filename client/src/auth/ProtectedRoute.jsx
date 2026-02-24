import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthed, booting } = useAuth();
  const loc = useLocation();

  if (booting) {
    return (
      <div className="container" style={{ padding: 24 }}>
        <div className="card">Loading...</div>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return children;
}