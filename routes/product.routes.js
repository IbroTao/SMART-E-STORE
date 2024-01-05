const { Router } = require("express");
const router = Router();

const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
} = require("../controllers/product.controller");

router.post("/create", createProduct);
router.get("/all", getAllProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);

module.exports = router;
