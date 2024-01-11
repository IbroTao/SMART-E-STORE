const blogCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await blogCategory.create(req.body);
    res
      .status(200)
      .json({
        message: "Blog Category created successfully.",
        category: category,
      });
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await blogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ message: "Blog category not found!" });

    res
      .status(200)
      .json({
        message: "Blog category updated successfully.",
        category: category,
      });
  } catch (error) {
    throw new Error(error);
  }
});

const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await blogCategory.find().sort({
      createdAt: "desc",
    });
    if (!categories)
      return res.status(404).json({ message: "No blog category found" });

    res.status(200).json({ categories: categories });
  } catch (error) {
    throw new Error(error);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await blogCategory.findById(id);
    if (!category)
      return res.status(404).json({ message: "Blog category not found!" });

    res.status(200).json({ category: category });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await blogCategory.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ message: "Blog category not found!" });

    res.status(200).json({ message: "Blog category deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  getCategories,
  getCategory,
  deleteCategory,
};
