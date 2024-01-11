const { Router } = require("express");
const router = Router();

const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
} = require("../controllers/product.controller");

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/", authMiddleware, isAdmin, getAllProducts);
router.put("/wishlist", authMiddleware, isAdmin, addToWishList);
router.get("/:id", authMiddleware, isAdmin, getProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
