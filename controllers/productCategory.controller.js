const Category = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// CREATE CATEGORY
const createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res
      .status(200)
      .json({ message: "Category created successfully.", category: category });
  } catch (error) {
    throw new Error(error);
  }
});

// GET ALL CATEGORIES
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: "desc",
    });
    res.status(200).json({ categories: categories });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  getAllCategories,
};
