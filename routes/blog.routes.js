const { Router } = require("express");
const { createBlog } = require("../controllers/blog.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = Router();

router.post("/create", authMiddleware, isAdmin, createBlog);

module.exports = router;
