const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 180 },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "", maxlength: 400 },
    content: { type: String, default: "", maxlength: 20000 }, // markdown text
    coverImage: { type: String, default: "" },
    tags: [{ type: String, trim: true }],

    isFeatured: { type: Boolean, default: false }, // NEW
    isPublished: { type: Boolean, default: false },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

postSchema.index({ title: "text", excerpt: "text", content: "text" });

module.exports = mongoose.model("Post", postSchema);