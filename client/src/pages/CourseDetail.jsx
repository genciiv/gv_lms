import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function CourseDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { isAuthed } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [access, setAccess] = useState("preview"); // preview | enrolled | admin
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const cRes = await api.get(`/api/courses/${slug}`);
      const c = cRes.data.course;
      setCourse(c);

      const lRes = await api.get(`/api/lessons/by-course/${c._id}`);
      setLessons(lRes.data.lessons || []);
      setAccess(lRes.data.access || "preview");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const canEnroll = useMemo(() => {
    if (!isAuthed) return true; // do redirect to login
    return access !== "enrolled" && access !== "admin";
  }, [isAuthed, access]);

  async function onEnroll() {
    if (!course) return;

    if (!isAuthed) {
      nav("/login", { state: { from: `/courses/${slug}` } });
      return;
    }

    setEnrolling(true);
    setErr("");
    try {
      await api.post(`/api/enroll/${course._id}`);
      // after enroll, go directly to player
      nav(`/dashboard/courses/${course._id}`);
    } catch (e) {
      setErr(e?.response?.data?.message || "Enroll failed");
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) return <div className="container"><div className="card">Loading...</div></div>;

  if (err && !course) {
    return (
      <div className="container">
        <div className="alert">{err}</div>
        <div style={{ marginTop: 12 }}>
          <Link className="btn btnGhost" to="/courses">Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {err && <div className="alert" style={{ marginTop: 12 }}>{err}</div>}

      <div className="courseHero">
        <div>
          <div className="kicker">Course</div>
          <h1 className="h2" style={{ marginTop: 6 }}>{course.title}</h1>
          <div className="muted">
            {course.category || "General"} • {course.level || "Beginner"}
          </div>

          {course.description && (
            <p className="muted" style={{ marginTop: 12, maxWidth: 820 }}>
              {course.description}
            </p>
          )}

          <div className="row" style={{ marginTop: 16, gap: 10, flexWrap: "wrap" }}>
            {canEnroll ? (
              <button className="btn" disabled={enrolling} onClick={onEnroll}>
                {enrolling ? "Enrolling..." : "Enroll Now →"}
              </button>
            ) : (
              <Link className="btn" to={`/dashboard/courses/${course._id}`}>
                Continue Learning →
              </Link>
            )}

            <Link className="btn btnGhost" to="/courses">
              Back to Courses
            </Link>
          </div>

          <div className="muted small" style={{ marginTop: 10 }}>
            Access: <b>{access}</b>
          </div>
        </div>

        <div className="courseCard">
          <div className="thumb" style={{ height: 180 }} />
          <div style={{ marginTop: 10 }}>
            <div className="title">What you’ll learn</div>
            <ul className="muted small" style={{ marginTop: 8, paddingLeft: 18 }}>
              <li>Structured lessons (video/text)</li>
              <li>Track progress</li>
              <li>Dashboard learning</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 10 }}>
        <div className="sectionHead">
          <div>
            <div className="kicker">Lessons</div>
            <h2 className="h2">Course Content</h2>
            <p className="muted">
              {access === "preview"
                ? "Preview lessons only (Enroll to unlock full content)."
                : "Full access to lessons."}
            </p>
          </div>
        </div>

        <div className="card">
          {lessons.length === 0 && <div className="muted">No lessons yet.</div>}

          {lessons.map((l) => (
            <div key={l._id} className="lessonRow">
              <div>
                <div className="title" style={{ fontSize: 15 }}>
                  {l.order}. {l.title}
                </div>
                <div className="muted small">
                  {l.contentType === "video" ? "Video" : "Text"}{" "}
                  {l.isFreePreview ? "• Free preview" : ""}
                </div>
              </div>

              {access === "preview" ? (
                <span className="muted small">Locked</span>
              ) : (
                <Link className="btn btnGhost" to={`/dashboard/courses/${course._id}`}>
                  Open →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}