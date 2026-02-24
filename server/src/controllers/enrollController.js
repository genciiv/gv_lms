const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");

async function enroll(req, res) {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).lean();
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (!course.isPublished && req.user.role !== "admin")
    return res.status(404).json({ message: "Course not found" });

  const enrollment = await Enrollment.findOneAndUpdate(
    { userId: req.user._id, courseId },
    {
      $setOnInsert: { userId: req.user._id, courseId, progress: [], lastLessonId: null },
      $set: { lastAccessAt: new Date() }
    },
    { upsert: true, new: true }
  );

  return res.status(201).json({ enrollment });
}

async function myEnrollments(req, res) {
  const items = await Enrollment.find({ userId: req.user._id })
    .sort({ updatedAt: -1 })
    .populate({ path: "courseId", select: "title slug thumbnail category level isPublished" })
    .lean();

  const mapped = await Promise.all(
    items
      .filter((x) => x.courseId)
      .map(async (x) => {
        const totalLessons = await Lesson.countDocuments({ courseId: x.courseId._id });
        const completed = x.progress?.length || 0;
        const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

        return {
          _id: x._id,
          course: x.courseId,
          completedLessons: completed,
          totalLessons,
          progressPercent: percent,
          completedLessonIds: (x.progress || []).map((p) => String(p.lessonId)),
          lastLessonId: x.lastLessonId ? String(x.lastLessonId) : null,
          startedAt: x.startedAt,
          lastAccessAt: x.lastAccessAt
        };
      })
  );

  return res.json({ items: mapped });
}

/**
 * Status endpoint (for player):
 * returns enrollment progress + completed IDs + last lesson id
 */
async function status(req, res) {
  const { courseId } = req.params;

  const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId }).lean();
  if (!enrollment) return res.status(404).json({ message: "Not enrolled" });

  return res.json({
    courseId,
    completedLessonIds: (enrollment.progress || []).map((p) => String(p.lessonId)),
    lastLessonId: enrollment.lastLessonId ? String(enrollment.lastLessonId) : null,
    completedCount: enrollment.progress?.length || 0,
    lastAccessAt: enrollment.lastAccessAt
  });
}

async function completeLesson(req, res) {
  const { courseId, lessonId } = req.body;
  if (!courseId || !lessonId) return res.status(400).json({ message: "courseId and lessonId required" });

  const lesson = await Lesson.findOne({ _id: lessonId, courseId }).lean();
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });

  const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId });
  if (!enrollment) return res.status(403).json({ message: "Not enrolled" });

  const already = enrollment.progress.some((p) => String(p.lessonId) === String(lessonId));
  if (!already) {
    enrollment.progress.push({ lessonId, completedAt: new Date() });
  }

  enrollment.lastLessonId = lessonId;
  enrollment.lastAccessAt = new Date();
  await enrollment.save();

  return res.json({
    ok: true,
    completedLessonIds: enrollment.progress.map((p) => String(p.lessonId)),
    lastLessonId: enrollment.lastLessonId ? String(enrollment.lastLessonId) : null
  });
}

module.exports = { enroll, myEnrollments, status, completeLesson };