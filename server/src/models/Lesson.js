const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 180 },
    order: { type: Number, default: 1 },
    contentType: { type: String, enum: ["video", "text"], default: "video" },
    videoUrl: { type: String, default: "" },
    textContent: { type: String, default: "" },
    attachments: [{ label: { type: String, default: "" }, url: { type: String, default: "" } }],
    isFreePreview: { type: Boolean, default: false }
  },
  { timestamps: true }
);

lessonSchema.index({ courseId: 1, order: 1 });

module.exports = mongoose.model("Lesson", lessonSchema);