const { Router } = require("express");
const router = Router();

const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, isAdmin, createProduct);
router.get("/all", getAllProducts);
router.get("/:id", getProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
