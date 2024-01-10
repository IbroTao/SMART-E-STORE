const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// CREATE A BLOG
const createBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ message: "Blog created successfully", blog: blog });
  } catch (error) {
    throw new Error(error);
  }
});

// UPDATE A BLOG
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Blog updated successfully", blog: blog });
  } catch (error) {
    throw new Error(error);
  }
});

// GET A SINGLE BLOG
const getSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findById(id);
    const updatedViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: {
          numViews: 1,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

// GET ALL BLOGS
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find().sort({
      createdAt: "desc",
    });
    if (!blogs) return res.status(404).json({ message: "No blog found!" });

    res.status(200).json({ blogs: blogs });
  } catch (error) {
    throw new Error(error);
  }
});

// DELETE A BLOG
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ message: "Blog not found!" });

    res.status(200).json({ message: "Blog deleted sucessfully!" });
  } catch (error) {
    throw new Error(error);
  }
});

// LIKE A BLOG
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(id);
  try {
    // Find the blog a user wants to like
    const blog = await Blog.findById(blogId);
    const userId = req.user._id;

    const isLiked = blog.isLiked;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
  getAllBlogs,
  deleteBlog,
};
