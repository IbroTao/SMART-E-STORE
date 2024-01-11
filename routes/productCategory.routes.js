const { Router } = require("express");
const router = Router();

const {
  createCategory,
  getAllCategories,
} = require("../controllers/productCategory.controller");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/", authMiddleware, isAdmin, getAllCategories);

module.exports = router;
