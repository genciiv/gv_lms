import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="dash">
      <aside className="sidebar">
        <div className="brand">
          <div className="logoDot" />
          <div>
            <div className="brandName">Educax</div>
            <div className="muted">User Dashboard</div>
          </div>
        </div>

        <nav className="navcol">
          <NavLink end to="/dashboard" className="navitem">
            Overview
          </NavLink>
          <NavLink to="/dashboard/courses" className="navitem">
            My Courses
          </NavLink>
          <NavLink to="/dashboard/profile" className="navitem">
            Profile
          </NavLink>
        </nav>

        <div className="sidebarBottom">
          <div className="muted small">
            Signed in as <b>{user?.name}</b>
          </div>
          <button className="btn btnGhost w100" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <section className="dashMain">
        <header className="dashTop">
          <div>
            <div className="title">Welcome, {user?.name}</div>
            <div className="muted">Manage your learning and profile.</div>
          </div>
        </header>

        <div className="dashContent">
          <Outlet />
        </div>
      </section>
    </div>
  );
}