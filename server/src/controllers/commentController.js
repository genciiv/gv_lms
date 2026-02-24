const Post = require("../models/Post");
const Comment = require("../models/Comment");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* USER adds comment (pending approval by default) */
async function addComment(req, res) {
  const { postId, text } = req.body;
  if (!postId || !text) return res.status(400).json({ message: "postId and text required" });

  const post = await Post.findById(postId).lean();
  if (!post || !post.isPublished) return res.status(404).json({ message: "Post not found" });

  const name = req.user?.name || "User";
  const email = req.user?.email || "";
  if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid user email" });

  const c = await Comment.create({
    postId,
    userId: req.user._id,
    name,
    email,
    text: String(text).trim(),
    isApproved: false
  });

  return res.status(201).json({ ok: true, commentId: c._id, message: "Comment submitted for review" });
}

/* ADMIN moderation */
async function adminListComments(req, res) {
  const { postId } = req.query;
  const q = {};
  if (postId) q.postId = postId;

  const items = await Comment.find(q)
    .sort({ createdAt: -1 })
    .select("postId name email text isApproved createdAt")
    .lean();

  return res.json({ items });
}

async function adminSetApproval(req, res) {
  const { id } = req.params;
  const { isApproved } = req.body;

  const c = await Comment.findById(id);
  if (!c) return res.status(404).json({ message: "Comment not found" });

  if (typeof isApproved !== "boolean") return res.status(400).json({ message: "isApproved must be boolean" });

  c.isApproved = isApproved;
  await c.save();

  return res.json({ ok: true });
}

async function adminDeleteComment(req, res) {
  const { id } = req.params;
  const c = await Comment.findById(id);
  if (!c) return res.status(404).json({ message: "Comment not found" });
  await c.deleteOne();
  return res.json({ ok: true });
}

module.exports = { addComment, adminListComments, adminSetApproval, adminDeleteComment };