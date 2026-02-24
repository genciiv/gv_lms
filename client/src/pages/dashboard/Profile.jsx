import { useAuth } from "../../auth/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="card">
      <div className="title">Profile</div>

      <div className="muted small" style={{ marginTop: 12 }}>
        Name
      </div>
      <div style={{ fontWeight: 800 }}>{user?.name || "-"}</div>

      <div className="muted small" style={{ marginTop: 12 }}>
        Email
      </div>
      <div style={{ fontWeight: 800 }}>{user?.email || "-"}</div>

      <div className="muted small" style={{ marginTop: 12 }}>
        Role
      </div>
      <div style={{ fontWeight: 800 }}>{user?.role || "-"}</div>
    </div>
  );
}