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
      // 1) Lessons list + access
      const lRes = await api.get(`/api/lessons/by-course/${courseId}`);
      const list = lRes.data.lessons || [];
      setLessons(list);
      setAccess(lRes.data.access || "preview");

      // If preview -> stop here
      if ((lRes.data.access || "preview") === "preview") {
        setCourse({ _id: courseId, title: "Course" });
        setActiveId(list[0]?._id || "");
        setLoading(false);
        return;
      }

      // 2) Course title (admin list includes all; user list includes published)
      // This is a lightweight way to show title; later we can add GET course by id endpoint.
      const cRes = await api.get("/api/courses");
      const found = (cRes.data.items || []).find((x) => x._id === courseId);
      setCourse(found || { _id: courseId, title: "Course" });

      // 3) REAL progress state
      const sRes = await api.get(`/api/enroll/status/${courseId}`);
      const completed = new Set(sRes.data.completedLessonIds || []);
      setCompletedIds(completed);

      // 4) Continue from last lesson (if exists), else first lesson
      const lastId = sRes.data.lastLessonId;
      const hasLast = lastId && list.some((l) => l._id === lastId);
      setActiveId(hasLast ? lastId : (list[0]?._id || ""));
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
      const res = await api.post("/api/enroll/complete", {
        courseId,
        lessonId: active._id
      });

      const ids = res.data.completedLessonIds || [];
      setCompletedIds(new Set(ids));
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
          You are not enrolled. Go to course details and enroll.
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
          <div className="muted small">
            Lessons: {lessons.length} • Completed: {completedIds.size}
          </div>
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
                Type: {active?.contentType}{" "}
                {completedIds.has(active?._id) ? "• ✅ Completed" : ""}
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
                    Video URL:{" "}
                    <a href={active.videoUrl} target="_blank" rel="noreferrer">
                      {active.videoUrl}
                    </a>
                  </div>
                  <div className="muted" style={{ marginTop: 10 }}>
                    (Më pas e bëjmë embed player real.)
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