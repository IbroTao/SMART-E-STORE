const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const validMongoId = require("../utils/validateMongodbId");

// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// GET A PRODUCT
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoId(id);
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// GET ALL PRODUCTS
const getProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (err) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
};
