import { useEffect, useState } from "react";
import { api } from "../../api";
import { Link, useParams } from "react-router-dom";

export default function AdminLessons() {
  const { courseId } = useParams();
  const [items, setItems] = useState([]);

  async function load() {
    const res = await api.get(`/api/lessons/by-course/${courseId}`);
    setItems(res.data.lessons || []);
  }

  async function remove(id) {
    if (!confirm("Delete lesson?")) return;
    await api.delete(`/api/lessons/${id}`);
    load();
  }

  useEffect(() => { load(); }, [courseId]);

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 className="h2">Lessons</h2>
        <Link className="btn" to={`/admin/courses/${courseId}/lessons/new`}>+ New Lesson</Link>
      </div>

      <div className="card">
        {items.map(l => (
          <div key={l._id} className="row" style={{ justifyContent: "space-between" }}>
            <div>{l.order}. {l.title}</div>
            <div>
              <Link className="btn btnGhost"
                to={`/admin/courses/${courseId}/lessons/${l._id}`}>Edit</Link>{" "}
              <button className="btn btnGhost" onClick={() => remove(l._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}