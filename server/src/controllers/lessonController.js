const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");

async function listLessonsByCourse(req, res) {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).lean();
  if (!course) return res.status(404).json({ message: "Course not found" });

  const isAdmin = req.user?.role === "admin";

  // nëse kursi s’është published dhe s’je admin → 404
  if (!isAdmin && !course.isPublished) return res.status(404).json({ message: "Course not found" });

  // kontroll enrollment (nëse user i loguar)
  let isEnrolled = false;
  if (req.user && !isAdmin) {
    const enr = await Enrollment.findOne({ userId: req.user._id, courseId });
    isEnrolled = !!enr;
  }

  const lessons = await Lesson.find({ courseId })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  // nëse s’je admin dhe s’je enrolled → kthe vetëm free preview (pa content)
  if (!isAdmin && !isEnrolled) {
    const filtered = lessons
      .filter((l) => l.isFreePreview)
      .map((l) => ({
        _id: l._id,
        courseId: l.courseId,
        title: l.title,
        order: l.order,
        contentType: l.contentType,
        isFreePreview: l.isFreePreview,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt
      }));
    return res.json({ lessons: filtered, access: "preview" });
  }

  // nëse admin ose enrolled → kthe gjithçka
  return res.json({ lessons, access: isAdmin ? "admin" : "enrolled" });
}

async function createLesson(req, res) {
  const { courseId, title, order = 1, contentType = "video", videoUrl = "", textContent = "", attachments = [], isFreePreview = false } =
    req.body;

  if (!courseId) return res.status(400).json({ message: "courseId required" });
  if (!title || String(title).trim().length < 2) return res.status(400).json({ message: "title required" });

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (contentType === "video" && !videoUrl && !isFreePreview) {
    // videoUrl mund ta lësh bosh në fillim, por zakonisht vendoset
  }

  const lesson = await Lesson.create({
    courseId,
    title: String(title).trim(),
    order: Number(order) || 1,
    contentType,
    videoUrl,
    textContent,
    attachments: Array.isArray(attachments) ? attachments : [],
    isFreePreview: !!isFreePreview
  });

  return res.status(201).json({ lesson });
}

async function updateLesson(req, res) {
  const { id } = req.params;
  const { title, order, contentType, videoUrl, textContent, attachments, isFreePreview } = req.body;

  const lesson = await Lesson.findById(id);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });

  if (typeof title === "string" && title.trim().length >= 2) lesson.title = title.trim();
  if (order !== undefined) lesson.order = Number(order) || lesson.order;
  if (typeof contentType === "string") lesson.contentType = contentType;
  if (typeof videoUrl === "string") lesson.videoUrl = videoUrl;
  if (typeof textContent === "string") lesson.textContent = textContent;
  if (Array.isArray(attachments)) lesson.attachments = attachments;
  if (typeof isFreePreview === "boolean") lesson.isFreePreview = isFreePreview;

  await lesson.save();
  return res.json({ lesson });
}

async function deleteLesson(req, res) {
  const { id } = req.params;

  const lesson = await Lesson.findById(id);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });

  // hiq progress entries nga enrollment-et
  await Enrollment.updateMany(
    { courseId: lesson.courseId },
    { $pull: { progress: { lessonId: lesson._id } } }
  );

  await lesson.deleteOne();
  return res.json({ ok: true });
}

module.exports = { listLessonsByCourse, createLesson, updateLesson, deleteLesson };