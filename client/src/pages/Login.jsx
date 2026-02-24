import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const u = await login(email, password);
      const go = u.role === "admin" ? "/admin" : (loc.state?.from || "/dashboard");
      nav(go);
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container authWrap">
      <div className="card authCard">
        <h1 className="h2">Login</h1>
        <p className="muted">Access your dashboard.</p>

        {err && <div className="alert">{err}</div>}

        <form className="form" onSubmit={onSubmit}>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            autoComplete="email"
            required
          />
          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            required
          />

          <button className="btn w100" disabled={loading}>
            {loading ? "Please wait..." : "Login →"}
          </button>
        </form>

        <div className="muted small" style={{ marginTop: 10 }}>
          No account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}