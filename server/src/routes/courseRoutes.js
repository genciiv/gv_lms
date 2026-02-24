const router = require("express").Router();
const { listCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse } = require("../controllers/courseController");
const { optionalAuth, auth, isAdmin } = require("../middlewares/auth");

// Public (admin sees all if token provided)
router.get("/", optionalAuth, listCourses);
router.get("/:slug", optionalAuth, getCourseBySlug);

// Admin CRUD
router.post("/", auth, isAdmin, createCourse);
router.put("/:id", auth, isAdmin, updateCourse);
router.delete("/:id", auth, isAdmin, deleteCourse);

module.exports = router;