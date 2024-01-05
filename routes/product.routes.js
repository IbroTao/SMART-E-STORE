const { Router } = require("express");
const router = Router();

const {
  createProduct,
  getProduct,
  getProducts,
} = require("../controllers/product.controller");

router.post("/create", createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

module.exports = router;
