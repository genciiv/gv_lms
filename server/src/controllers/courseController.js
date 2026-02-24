const slugify = require("slugify");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

function makeSlug(title) {
  return slugify(String(title || ""), { lower: true, strict: true, trim: true });
}

async function ensureUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await Course.findOne({ slug });
    if (!exists) return slug;
    slug = `${baseSlug}-${n++}`;
  }
}

async function listCourses(req, res) {
  const isAdmin = req.user?.role === "admin";
  const q = {};

  if (!isAdmin) q.isPublished = true;

  const items = await Course.find(q)
    .sort({ createdAt: -1 })
    .select("title slug category level thumbnail isPublished createdAt updatedAt")
    .lean();

  return res.json({ items });
}

async function getCourseBySlug(req, res) {
  const { slug } = req.params;
  const course = await Course.findOne({ slug }).lean();
  if (!course) return res.status(404).json({ message: "Course not found" });

  const isAdmin = req.user?.role === "admin";
  if (!isAdmin && !course.isPublished) return res.status(404).json({ message: "Course not found" });

  const lessonsCount = await Lesson.countDocuments({ courseId: course._id });

  return res.json({ course: { ...course, lessonsCount } });
}

async function createCourse(req, res) {
  const { title, description = "", category = "General", level = "Beginner", thumbnail = "" } = req.body;

  if (!title || String(title).trim().length < 3)
    return res.status(400).json({ message: "Title is required (min 3 chars)" });

  const baseSlug = makeSlug(title);
  if (!baseSlug) return res.status(400).json({ message: "Invalid title" });

  const slug = await ensureUniqueSlug(baseSlug);

  const course = await Course.create({
    title: String(title).trim(),
    slug,
    description,
    category,
    level,
    thumbnail,
    createdBy: req.user._id,
    isPublished: false
  });

  return res.status(201).json({ course });
}

async function updateCourse(req, res) {
  const { id } = req.params;
  const { title, description, category, level, thumbnail, isPublished } = req.body;

  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (typeof title === "string" && title.trim().length >= 3) {
    const baseSlug = makeSlug(title);
    const slug = course.title === title.trim() ? course.slug : await ensureUniqueSlug(baseSlug);
    course.title = title.trim();
    course.slug = slug;
  }
  if (typeof description === "string") course.description = description;
  if (typeof category === "string") course.category = category;
  if (typeof thumbnail === "string") course.thumbnail = thumbnail;
  if (typeof level === "string") course.level = level;
  if (typeof isPublished === "boolean") course.isPublished = isPublished;

  await course.save();
  return res.json({ course });
}

async function deleteCourse(req, res) {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  await Lesson.deleteMany({ courseId: course._id });
  const Enrollment = require("../models/Enrollment");
  await Enrollment.deleteMany({ courseId: course._id });

  await course.deleteOne();
  return res.json({ ok: true });
}

module.exports = { listCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse };