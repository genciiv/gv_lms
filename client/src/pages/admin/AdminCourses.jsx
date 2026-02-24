import { useEffect, useState } from "react";
import { api } from "../../api";
import { Link } from "react-router-dom";

export default function AdminCourses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await api.get("/api/courses");
    setItems(res.data.items);
    setLoading(false);
  }

  async function remove(id) {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/api/courses/${id}`);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 className="h2">Courses</h2>
        <Link className="btn" to="/admin/courses/new">+ New Course</Link>
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
            {items.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td align="center">{c.isPublished ? "✅" : "❌"}</td>
                <td align="center">
                  <Link className="btn btnGhost" to={`/admin/courses/${c._id}`}>Edit</Link>{" "}
                  <Link className="btn btnGhost" to={`/admin/courses/${c._id}/lessons`}>Lessons</Link>{" "}
                  <button className="btn btnGhost" onClick={() => remove(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}