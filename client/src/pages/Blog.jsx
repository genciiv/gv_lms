import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

export default function Blog() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/api/posts");
      setItems(res.data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((p) => {
    const t = (p.title || "").toLowerCase();
    const qq = q.trim().toLowerCase();
    return !qq || t.includes(qq);
  });

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <h1 className="h2">Blog</h1>
          <p className="muted">Latest articles and updates.</p>
        </div>

        <input
          className="input"
          style={{ maxWidth: 320 }}
          placeholder="Search posts..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {err && <div className="alert" style={{ marginTop: 12 }}>{err}</div>}
      {loading && <div className="card" style={{ marginTop: 12 }}>Loading...</div>}

      {!loading && (
        <div className="grid" style={{ marginTop: 14 }}>
          {filtered.map((p) => (
            <div key={p.slug} className="card">
              <div className="thumb" />
              <div className="title" style={{ marginTop: 10 }}>{p.title}</div>
              <div className="muted small">
                {p.excerpt || "No excerpt"}
              </div>

              <div className="row" style={{ marginTop: 12, justifyContent: "space-between" }}>
                <Link className="btn btnGhost" to={`/blog/${p.slug}`}>
                  Read →
                </Link>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="card" style={{ gridColumn: "1 / -1" }}>
              No posts found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}