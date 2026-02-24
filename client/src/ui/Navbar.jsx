import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { isAuthed, isAdmin, user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="topbar">
      <div className="container topbarInner">
        <Link to="/" className="logo">
          <span className="logoMark" />
          <span>Educax</span>
        </Link>

        <nav className="topnav">
          <NavLink to="/" end className="toplink">
            Home
          </NavLink>
          <NavLink to="/courses" className="toplink">
            Courses
          </NavLink>
          <NavLink to="/blog" className="toplink">
            Blog
          </NavLink>
          <NavLink to="/contact" className="toplink">
            Contact
          </NavLink>
        </nav>

        <div className="topActions">
          {!isAuthed ? (
            <>
              <Link className="btn btnGhost" to="/login">
                Login
              </Link>
              <Link className="btn" to="/register">
                Register →
              </Link>
            </>
          ) : (
            <>
              <button
                className="btn btnGhost"
                onClick={() => nav(isAdmin ? "/admin" : "/dashboard")}
              >
                {isAdmin ? "Admin" : "Dashboard"}
              </button>
              <button className="btn" onClick={logout} title={user?.email}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}