import { useAuth } from "../../auth/AuthContext";

export default function AdminHome() {
  const { user } = useAuth();

  return (
    <div className="stack">
      <div className="card">
        <div className="title">Admin Overview</div>
        <div className="muted">
          Welcome <b>{user?.name}</b>. Here you will manage users, courses, lessons and blog.
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="title">Users</div>
          <div className="muted small">Manage all users</div>
        </div>
        <div className="card">
          <div className="title">Courses</div>
          <div className="muted small">Create & publish courses</div>
        </div>
        <div className="card">
          <div className="title">Blog</div>
          <div className="muted small">Create posts & moderate comments</div>
        </div>
      </div>
    </div>
  );
}