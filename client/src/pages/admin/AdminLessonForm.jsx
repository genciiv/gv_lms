import { useEffect, useState } from "react";
import { api } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminLessonForm() {
  const { courseId, lessonId } = useParams();
  const nav = useNavigate();
  const isNew = lessonId === "new";

  const [form, setForm] = useState({
    title: "",
    order: 1,
    contentType: "text",
    textContent: "",
    videoUrl: "",
    isFreePreview: false
  });

  useEffect(() => {
    if (!isNew) {
      api.get(`/api/lessons/by-course/${courseId}`).then(res => {
        const l = res.data.lessons.find(x => x._id === lessonId);
        if (l) setForm(l);
      });
    }
  }, [courseId, lessonId, isNew]);

  async function submit(e) {
    e.preventDefault();
    const payload = { ...form, courseId };
    if (isNew) {
      await api.post("/api/lessons", payload);
    } else {
      await api.put(`/api/lessons/${lessonId}`, payload);
    }
    nav(`/admin/courses/${courseId}/lessons`);
  }

  return (
    <div className="card">
      <h2 className="h2">{isNew ? "New Lesson" : "Edit Lesson"}</h2>

      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} required />

        <input className="input" type="number" placeholder="Order"
          value={form.order}
          onChange={e => setForm({ ...form, order: e.target.value })} />

        <select className="input"
          value={form.contentType}
          onChange={e => setForm({ ...form, contentType: e.target.value })}>
          <option value="text">Text</option>
          <option value="video">Video</option>
        </select>

        {form.contentType === "text" ? (
          <textarea className="input" rows="6"
            value={form.textContent}
            onChange={e => setForm({ ...form, textContent: e.target.value })} />
        ) : (
          <input className="input" placeholder="Video URL"
            value={form.videoUrl}
            onChange={e => setForm({ ...form, videoUrl: e.target.value })} />
        )}

        <label>
          <input type="checkbox"
            checked={form.isFreePreview}
            onChange={e => setForm({ ...form, isFreePreview: e.target.checked })} />
          {" "}Free preview
        </label>

        <button className="btn">Save Lesson</button>
      </form>
    </div>
  );
}