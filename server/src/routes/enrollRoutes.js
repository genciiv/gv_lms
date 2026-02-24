const router = require("express").Router();
const { enroll, myEnrollments, status, completeLesson } = require("../controllers/enrollController");
const { auth } = require("../middlewares/auth");

router.post("/:courseId", auth, enroll);
router.get("/my", auth, myEnrollments);

// NEW: get exact progress state for a course
router.get("/status/:courseId", auth, status);

router.post("/complete", auth, completeLesson);

module.exports = router;