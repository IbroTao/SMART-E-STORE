const { Router } = require("express");
const router = Router();

const {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/productCategory.controller");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/", authMiddleware, isAdmin, getAllCategories);
router.get("/:id", authMiddleware, isAdmin, getSingleCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id".authMiddleware, isAdmin, deleteCategory);

module.exports = router;
