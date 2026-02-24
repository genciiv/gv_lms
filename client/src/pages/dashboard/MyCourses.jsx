import { useEffect, useState } from "react";
import { api } from "../../api";
import { Link } from "react-router-dom";

export default function MyCourses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/api/enroll/my");
      setItems(res.data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load your courses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 className="h2">My Courses</h2>
        <Link className="btn btnGhost" to="/courses">Browse Courses →</Link>
      </div>

      {err && <div className="alert">{err}</div>}

      {items.length === 0 ? (
        <div className="card">
          <div className="title">No enrollments yet</div>
          <div className="muted">Go to Courses and enroll in your first course.</div>
          <div style={{ marginTop: 12 }}>
            <Link className="btn" to="/courses">Browse Courses →</Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {items.map((x) => (
            <div key={x._id} className="card">
              <div className="thumb" />
              <div className="title" style={{ marginTop: 10 }}>
                {x.course?.title}
              </div>
              <div className="muted small">
                {x.course?.category || "General"} • {x.course?.level || "Beginner"}
              </div>

              <div className="progressWrap" style={{ marginTop: 12 }}>
                <div className="muted small">
                  Progress: <b>{x.progressPercent}%</b>
                </div>
                <div className="bar">
                  <div className="barFill" style={{ width: `${x.progressPercent}%` }} />
                </div>
                <div className="muted small">
                  {x.completedLessons}/{x.totalLessons} lessons completed
                </div>
              </div>

              <div className="row" style={{ marginTop: 12, justifyContent: "space-between" }}>
                <Link className="btn" to={`/dashboard/courses/${x.course?._id}`}>
                  Continue →
                </Link>
                <Link className="btn btnGhost" to={`/courses/${x.course?.slug}`}>
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}