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

// UPDATE CATEGORY
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Category updated successfully", category: category });
  } catch (error) {
    throw new Error(error);
  }
});

// GET SINGLE CATEGORY
const getSingleCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found!" });

    res.status(200).json({ category: category });
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

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ message: "Category not found!" });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  getSingleCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
