const router = require("express").Router();
const { listLessonsByCourse, createLesson, updateLesson, deleteLesson } = require("../controllers/lessonController");
const { optionalAuth, auth, isAdmin } = require("../middlewares/auth");

// list lessons by course (preview/enrolled/admin logic)
router.get("/by-course/:courseId", optionalAuth, listLessonsByCourse);

// admin CRUD
router.post("/", auth, isAdmin, createLesson);
router.put("/:id", auth, isAdmin, updateLesson);
router.delete("/:id", auth, isAdmin, deleteLesson);

module.exports = router;