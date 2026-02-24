import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="dash">
      <aside className="sidebar">
        <div className="brand">
          <div className="logoDot" />
          <div>
            <div className="brandName">Educax</div>
            <div className="muted">Admin Panel</div>
          </div>
        </div>

        <nav className="navcol">
          <NavLink end to="/admin" className="navitem">
            Overview
          </NavLink>
          <NavLink to="/admin/users" className="navitem">
            Users
          </NavLink>
          <NavLink to="/admin/courses" className="navitem">
            Courses
          </NavLink>
          <NavLink to="/admin/posts" className="navitem">
            Blog Posts
          </NavLink>
        </nav>

        <div className="sidebarBottom">
          <div className="muted small">
            Admin: <b>{user?.email}</b>
          </div>
          <button className="btn btnGhost w100" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <section className="dashMain">
        <header className="dashTop">
          <div>
            <div className="title">Admin Dashboard</div>
            <div className="muted">Manage users, courses, lessons & blog.</div>
          </div>
        </header>

        <div className="dashContent">
          <Outlet />
        </div>
      </section>
    </div>
  );
}