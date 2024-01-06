const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");

// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

// GET A PRODUCT
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// GET ALL PRODUCTS
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludeFields = ["sort", "price", "fields", "sort"];
    excludeFields.forEach((el) => delete queryObject[el]);
    const products = await Product.find(queryObject);
    res.status(200).json(products);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
};
