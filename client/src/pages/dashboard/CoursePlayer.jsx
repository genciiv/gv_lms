import { useEffect, useMemo, useState } from "react";
import { api } from "../../api";
import { Link, useParams } from "react-router-dom";

export default function CoursePlayer() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [access, setAccess] = useState("preview"); // preview | enrolled | admin
  const [activeId, setActiveId] = useState("");
  const [completedIds, setCompletedIds] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function loadAll() {
    setLoading(true);
    setErr("");
    try {
      // course info (admin/unpublished not needed here; enrolled users will access)
      const courseRes = await api.get(`/api/courses`).catch(() => ({ data: { items: [] } }));
      const found = (courseRes.data.items || []).find((x) => x._id === courseId);
      // fallback: course detail by slug not available here; we just show minimal if not found
      setCourse(found || { _id: courseId, title: "Course" });

      const lRes = await api.get(`/api/lessons/by-course/${courseId}`);
      setLessons(lRes.data.lessons || []);
      setAccess(lRes.data.access || "preview");

      const first = (lRes.data.lessons || [])[0];
      if (first) setActiveId(first._id);

      // load completed from enrollments
      const myRes = await api.get("/api/enroll/my");
      const enrollment = (myRes.data.items || []).find((x) => x.course?._id === courseId);
      if (enrollment) {
        // we don’t have lessonIds from API myEnrollments; so we infer completion from percent only
        // but completion needs IDs -> we mark locally after clicking.
        // (When you want exact completion IDs, we’ll add endpoint in Hapi 4D.)
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load course player");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const active = useMemo(
    () => lessons.find((l) => l._id === activeId) || lessons[0],
    [lessons, activeId]
  );

  async function markCompleted() {
    if (!active?._id) return;
    setSaving(true);
    setErr("");
    try {
      await api.post("/api/enroll/complete", { courseId, lessonId: active._id });
      setCompletedIds((prev) => new Set(prev).add(active._id));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to mark completed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="card">Loading...</div>;

  if (access === "preview") {
    return (
      <div className="card">
        <div className="title">Locked content</div>
        <div className="muted" style={{ marginTop: 8 }}>
          You are not enrolled. Go back to course details and enroll.
        </div>
        <div style={{ marginTop: 12 }}>
          <Link className="btn" to="/courses">Browse Courses →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <aside className="playerSide">
        <div className="playerHead">
          <div className="title">{course?.title || "Course"}</div>
          <div className="muted small">Lessons: {lessons.length}</div>
        </div>

        <div className="playerList">
          {lessons.map((l) => {
            const isActive = l._id === active?._id;
            const done = completedIds.has(l._id);
            return (
              <button
                key={l._id}
                className={`playerItem ${isActive ? "active" : ""}`}
                onClick={() => setActiveId(l._id)}
              >
                <div className="playerItemTop">
                  <div className="playerNum">{l.order}.</div>
                  <div className="playerTitle">{l.title}</div>
                </div>
                <div className="playerMeta">
                  <span>{l.contentType === "video" ? "Video" : "Text"}</span>
                  <span>{done ? "✅ Completed" : ""}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="playerFooter">
          <Link className="btn btnGhost w100" to="/dashboard/courses">
            Back to My Courses
          </Link>
        </div>
      </aside>

      <section className="playerMain">
        {err && <div className="alert">{err}</div>}

        <div className="card">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="kicker">Lesson</div>
              <div className="title" style={{ fontSize: 18, marginTop: 4 }}>
                {active?.order}. {active?.title}
              </div>
              <div className="muted small">
                Type: {active?.contentType}
              </div>
            </div>

            <button className="btn" disabled={saving || !active} onClick={markCompleted}>
              {saving ? "Saving..." : "Mark Completed ✓"}
            </button>
          </div>

          <div style={{ marginTop: 14 }}>
            {active?.contentType === "video" ? (
              active?.videoUrl ? (
                <div className="videoBox">
                  <div className="muted small">
                    Video URL: <a href={active.videoUrl} target="_blank" rel="noreferrer">{active.videoUrl}</a>
                  </div>
                  <div className="muted" style={{ marginTop: 10 }}>
                    (Në Hapin 6 e vendosim player-in e videos real me embed.)
                  </div>
                </div>
              ) : (
                <div className="muted">No video URL yet.</div>
              )
            ) : (
              <div className="lessonText">
                {active?.textContent ? active.textContent : "No text content yet."}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}