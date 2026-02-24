import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

export default function Courses() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/api/courses");
      setItems(res.data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((c) => {
    const s = (c.title || "").toLowerCase();
    const qq = q.trim().toLowerCase();
    return !qq || s.includes(qq);
  });

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <h1 className="h2">Courses</h1>
          <p className="muted">Browse available courses and enroll to start learning.</p>
        </div>

        <input
          className="input"
          style={{ maxWidth: 320 }}
          placeholder="Search courses..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {err && <div className="alert" style={{ marginTop: 12 }}>{err}</div>}
      {loading && <div className="card" style={{ marginTop: 12 }}>Loading...</div>}

      {!loading && (
        <div className="grid" style={{ marginTop: 14 }}>
          {filtered.map((c) => (
            <div key={c._id} className="card">
              <div className="thumb" />
              <div className="title" style={{ marginTop: 10 }}>{c.title}</div>
              <div className="muted small">
                {c.category || "General"} • {c.level || "Beginner"}
              </div>

              <div className="row" style={{ marginTop: 12, justifyContent: "space-between" }}>
                <Link className="btn btnGhost" to={`/courses/${c.slug}`}>
                  View →
                </Link>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="card" style={{ gridColumn: "1 / -1" }}>
              No courses found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}