import { useEffect, useState } from "react";
import { api } from "../api";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function BlogPost() {
  const { slug } = useParams();
  const { isAuthed } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    setMsg("");
    try {
      const res = await api.get(`/api/posts/${slug}`);
      setPost(res.data.post);
      setComments(res.data.comments || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function submitComment(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!isAuthed) {
      setErr("Please login to comment.");
      return;
    }

    if (!post?._id) return;
    if (!text.trim()) return;

    setSending(true);
    try {
      const res = await api.post("/api/posts/comment", { postId: post._id, text });
      setText("");
      setMsg(res.data.message || "Comment submitted.");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to submit comment");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div className="container"><div className="card">Loading...</div></div>;

  if (!post) {
    return (
      <div className="container">
        <div className="alert">{err || "Post not found"}</div>
        <div style={{ marginTop: 12 }}>
          <Link className="btn btnGhost" to="/blog">Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="kicker">Blog</div>
          <h1 className="h2" style={{ marginTop: 6 }}>{post.title}</h1>
          {post.excerpt && <p className="muted" style={{ maxWidth: 860 }}>{post.excerpt}</p>}
        </div>
        <Link className="btn btnGhost" to="/blog">Back</Link>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="muted small">Content</div>
        <div className="lessonText" style={{ marginTop: 10 }}>
          {post.content || "No content"}
        </div>
      </div>

      <div className="section">
        <div className="sectionHead">
          <div>
            <div className="kicker">Comments</div>
            <h2 className="h2">Discussion</h2>
            <p className="muted">Approved comments are shown below.</p>
          </div>
        </div>

        {msg && <div className="card" style={{ borderColor: "#bbf7d0" }}>{msg}</div>}
        {err && <div className="alert">{err}</div>}

        <div className="card" style={{ marginTop: 12 }}>
          <form className="form" onSubmit={submitComment}>
            <textarea
              className="input"
              rows="4"
              placeholder={isAuthed ? "Write a comment..." : "Login to comment"}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!isAuthed || sending}
            />
            <button className="btn" disabled={!isAuthed || sending || !text.trim()}>
              {sending ? "Sending..." : "Submit Comment"}
            </button>
            <div className="muted small">
              Your comment will be visible after admin approval.
            </div>
          </form>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          {comments.length === 0 ? (
            <div className="muted">No comments yet.</div>
          ) : (
            comments.map((c, idx) => (
              <div key={idx} className="lessonRow" style={{ alignItems: "flex-start" }}>
                <div>
                  <div className="title" style={{ fontSize: 14 }}>{c.name}</div>
                  <div className="muted small">{new Date(c.createdAt).toLocaleString()}</div>
                  <div className="lessonText" style={{ marginTop: 8 }}>{c.text}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}