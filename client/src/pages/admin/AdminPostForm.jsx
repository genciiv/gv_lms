import { useEffect, useState } from "react";
import { api } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminPostForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = id === "new";

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tagsText: "",
    isPublished: false
  });

  const [loading, setLoading] = useState(!isNew);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (isNew) return;

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get(`/api/posts/admin/${id}`);
        const p = res.data.post;
        setForm({
          title: p.title || "",
          excerpt: p.excerpt || "",
          content: p.content || "",
          coverImage: p.coverImage || "",
          tagsText: Array.isArray(p.tags) ? p.tags.join(", ") : "",
          isPublished: !!p.isPublished
        });
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  async function submit(e) {
    e.preventDefault();
    setErr("");

    const tags = form.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage,
      tags,
      isPublished: form.isPublished
    };

    try {
      if (isNew) {
        await api.post("/api/posts/admin", payload);
      } else {
        await api.put(`/api/posts/admin/${id}`, payload);
      }
      nav("/admin/posts");
    } catch (e) {
      setErr(e?.response?.data?.message || "Save failed");
    }
  }

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h2 className="h2">{isNew ? "New Post" : "Edit Post"}</h2>
      {err && <div className="alert">{err}</div>}

      <form className="form" onSubmit={submit}>
        <input
          className="input"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Excerpt"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />

        <textarea
          className="input"
          rows="10"
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <input
          className="input"
          placeholder="Cover Image URL (optional)"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
        />

        <input
          className="input"
          placeholder="Tags (comma separated)"
          value={form.tagsText}
          onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
        />

        <label className="muted small">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
          />{" "}
          Published
        </label>

        <button className="btn">Save</button>
      </form>
    </div>
  );
}