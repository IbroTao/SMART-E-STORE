const { Router } = require("express");
const router = Router();

const {
  createProduct,
  getProduct,
  getAllProducts,
} = require("../controllers/product.controller");

router.post("/create", createProduct);
router.get("/all", getAllProducts);
router.get("/:id", getProduct);

module.exports = router;
