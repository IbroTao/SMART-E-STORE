const { Router } = require("express");
const router = Router();

const { createProduct } = require("../controllers/product.controller");

router.post("/create", createProduct);

module.exports = router;
