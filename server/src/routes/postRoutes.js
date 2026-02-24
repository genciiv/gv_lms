const router = require("express").Router();
const { auth, isAdmin } = require("../middlewares/auth");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

/* PUBLIC */
router.get("/", postController.listPublished);
router.get("/:slug", postController.getPublishedBySlug);

/* USER comment */
router.post("/comment", auth, commentController.addComment);

/* ADMIN */
router.get("/admin/all", auth, isAdmin, postController.adminList);
router.get("/admin/:id", auth, isAdmin, postController.adminGetById);
router.post("/admin", auth, isAdmin, postController.adminCreate);
router.put("/admin/:id", auth, isAdmin, postController.adminUpdate);
router.delete("/admin/:id", auth, isAdmin, postController.adminDelete);

/* ADMIN comments moderation */
router.get("/admin-comments", auth, isAdmin, commentController.adminListComments);
router.put("/admin-comments/:id", auth, isAdmin, commentController.adminSetApproval);
router.delete("/admin-comments/:id", auth, isAdmin, commentController.adminDeleteComment);

module.exports = router;