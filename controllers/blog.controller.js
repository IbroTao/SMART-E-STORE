const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
};
