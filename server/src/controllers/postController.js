const slugify = require("slugify");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

function makeSlug(title) {
  return slugify(String(title || ""), { lower: true, strict: true, trim: true });
}

async function ensureUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let n = 2;
  while (true) {
    const exists = await Post.findOne({ slug });
    if (!exists) return slug;
    slug = `${baseSlug}-${n++}`;
  }
}

/* PUBLIC */
async function listPublished(req, res) {
  const q = { isPublished: true };
  const items = await Post.find(q)
    .sort({ createdAt: -1 })
    .select("title slug excerpt coverImage tags createdAt updatedAt")
    .lean();

  return res.json({ items });
}

async function getPublishedBySlug(req, res) {
  const { slug } = req.params;
  const post = await Post.findOne({ slug, isPublished: true })
    .populate({ path: "createdBy", select: "name" })
    .lean();

  if (!post) return res.status(404).json({ message: "Post not found" });

  const comments = await Comment.find({ postId: post._id, isApproved: true })
    .sort({ createdAt: -1 })
    .select("name text createdAt")
    .lean();

  return res.json({ post, comments });
}

/* ADMIN */
async function adminList(req, res) {
  const items = await Post.find({})
    .sort({ createdAt: -1 })
    .select("title slug excerpt isPublished createdAt updatedAt")
    .lean();

  return res.json({ items });
}

async function adminGetById(req, res) {
  const { id } = req.params;
  const post = await Post.findById(id).lean();
  if (!post) return res.status(404).json({ message: "Post not found" });
  return res.json({ post });
}

async function adminCreate(req, res) {
  const { title, excerpt = "", content = "", coverImage = "", tags = [], isPublished = false } = req.body;

  if (!title || String(title).trim().length < 3) {
    return res.status(400).json({ message: "Title required (min 3 chars)" });
  }

  const baseSlug = makeSlug(title);
  if (!baseSlug) return res.status(400).json({ message: "Invalid title" });
  const slug = await ensureUniqueSlug(baseSlug);

  const post = await Post.create({
    title: String(title).trim(),
    slug,
    excerpt,
    content,
    coverImage,
    tags: Array.isArray(tags) ? tags : [],
    isPublished: !!isPublished,
    createdBy: req.user._id
  });

  return res.status(201).json({ post });
}

async function adminUpdate(req, res) {
  const { id } = req.params;
  const { title, excerpt, content, coverImage, tags, isPublished } = req.body;

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (typeof title === "string" && title.trim().length >= 3) {
    const baseSlug = makeSlug(title);
    const newSlug = post.title === title.trim() ? post.slug : await ensureUniqueSlug(baseSlug);
    post.title = title.trim();
    post.slug = newSlug;
  }
  if (typeof excerpt === "string") post.excerpt = excerpt;
  if (typeof content === "string") post.content = content;
  if (typeof coverImage === "string") post.coverImage = coverImage;
  if (Array.isArray(tags)) post.tags = tags;
  if (typeof isPublished === "boolean") post.isPublished = isPublished;

  await post.save();
  return res.json({ post });
}

async function adminDelete(req, res) {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  await Comment.deleteMany({ postId: post._id });
  await post.deleteOne();

  return res.json({ ok: true });
}

module.exports = {
  listPublished,
  getPublishedBySlug,
  adminList,
  adminGetById,
  adminCreate,
  adminUpdate,
  adminDelete
};