const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },

    // progress entries (lesson completed)
    progress: [
      {
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
        completedAt: { type: Date, default: Date.now }
      }
    ],

    // continue feature
    lastLessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", default: null },

    startedAt: { type: Date, default: Date.now },
    lastAccessAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);