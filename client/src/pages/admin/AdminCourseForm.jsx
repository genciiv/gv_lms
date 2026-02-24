import { useEffect, useState } from "react";
import { api } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminCourseForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = id === "new";

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    isPublished: false
  });

  useEffect(() => {
    if (!isNew) {
      api.get(`/api/courses`).then(res => {
        const c = res.data.items.find(x => x._id === id);
        if (c) setForm(c);
      });
    }
  }, [id, isNew]);

  async function submit(e) {
    e.preventDefault();
    if (isNew) {
      await api.post("/api/courses", form);
    } else {
      await api.put(`/api/courses/${id}`, form);
    }
    nav("/admin/courses");
  }

  return (
    <div className="card">
      <h2 className="h2">{isNew ? "New Course" : "Edit Course"}</h2>

      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required />

        <textarea className="input" rows="5" placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />

        <input className="input" placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })} />

        <select className="input"
          value={form.level}
          onChange={e => setForm({ ...form, level: e.target.value })}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <label>
          <input type="checkbox"
            checked={form.isPublished}
            onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
          {" "}Published
        </label>

        <button className="btn">Save</button>
      </form>
    </div>
  );
}