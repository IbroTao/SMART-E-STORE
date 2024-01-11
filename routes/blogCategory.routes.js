const { Router } = require("express");
const router = Router();

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/blogCategory.controller");

router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/", authMiddleware, isAdmin, getCategories);
router.get("/:id", authMiddleware, isAdmin, getCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
