const { Router } = require("express");
const router = Router();

const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
} = require("../controllers/product.controller");

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

const {
  uploadPhoto,
  productImageResize,
} = require("../middlewares/uploadImages");

router.put("/rating", authMiddleware, rating);
router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/", authMiddleware, getAllProducts);
router.put("/wishlist", authMiddleware, addToWishList);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImageResize,
  uploadImages
);
router.get("/:id", authMiddleware, getProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
