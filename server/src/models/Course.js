const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 140 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "", maxlength: 4000 },
    category: { type: String, default: "General", trim: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    thumbnail: { type: String, default: "" },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);