import { useEffect, useState } from "react";
import { api } from "../../api";
import { Link } from "react-router-dom";

export default function AdminPosts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await api.get("/api/posts/admin/all");
    setItems(res.data.items || []);
    setLoading(false);
  }

  async function remove(id) {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/api/posts/admin/${id}`);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 className="h2">Blog Posts</h2>
        <Link className="btn" to="/admin/posts/new">+ New Post</Link>
      </div>

      <div className="card">
        <table width="100%">
          <thead>
            <tr>
              <th align="left">Title</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td align="center">{p.isPublished ? "✅" : "❌"}</td>
                <td align="center">
                  <Link className="btn btnGhost" to={`/admin/posts/${p._id}`}>Edit</Link>{" "}
                  <button className="btn btnGhost" onClick={() => remove(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminCommentsPanel />
    </div>
  );
}

/* Minimal comments moderation panel */
function AdminCommentsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await api.get("/api/posts/admin-comments");
    setItems(res.data.items || []);
    setLoading(false);
  }

  async function setApprove(id, isApproved) {
    await api.put(`/api/posts/admin-comments/${id}`, { isApproved });
    load();
  }

  async function remove(id) {
    if (!confirm("Delete comment?")) return;
    await api.delete(`/api/posts/admin-comments/${id}`);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="card">Loading comments...</div>;

  return (
    <div className="card">
      <div className="title">Comments Moderation</div>
      <div className="muted small" style={{ marginTop: 6 }}>
        Approve comments to make them visible on the public post page.
      </div>

      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.length === 0 && <div className="muted">No comments.</div>}

        {items.map((c) => (
          <div key={c._id} className="card" style={{ boxShadow: "none" }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <div className="title" style={{ fontSize: 14 }}>
                  {c.name} <span className="muted small">({c.email})</span>
                </div>
                <div className="muted small">{new Date(c.createdAt).toLocaleString()}</div>
                <div className="lessonText" style={{ marginTop: 8 }}>{c.text}</div>
                <div className="muted small" style={{ marginTop: 8 }}>
                  Status: <b>{c.isApproved ? "Approved" : "Pending"}</b>
                </div>
              </div>

              <div className="row" style={{ gap: 8 }}>
                <button
                  className="btn btnGhost"
                  onClick={() => setApprove(c._id, !c.isApproved)}
                >
                  {c.isApproved ? "Unapprove" : "Approve"}
                </button>
                <button className="btn btnGhost" onClick={() => remove(c._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}