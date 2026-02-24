const router = require("express").Router();
const { enroll, myEnrollments, completeLesson } = require("../controllers/enrollController");
const { auth } = require("../middlewares/auth");

router.post("/:courseId", auth, enroll);
router.get("/my", auth, myEnrollments);
router.post("/complete", auth, completeLesson);

module.exports = router;