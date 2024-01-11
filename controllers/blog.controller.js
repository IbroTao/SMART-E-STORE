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
  try {
    const { blogId } = req.body;
    validateMongodbId(blogId);

    const loginUserId = req.user._id;

    // Find the blog which the user wants to like
    const blog = await Blog.findById(blogId);

    // Check if the user has already liked the blog
    const isLiked = blog.isLiked;

    //Check if the user dislike the blog
    const isDisLiked = blog.dislikes.find(
      (userId) => userId.toString() === loginUserId.toString()
    );

    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      res.status(200).json(blog);
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        {
          new: true,
        }
      );
      res.status(200).json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        {
          new: true,
        }
      );
      res.status(200).json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// DISLIKE A BLOG
const dislikeBlog = asyncHandler(async (req, res) => {
  try {
    const { blogId } = req.body;
    validateMongodbId(blogId);

    const loginUserId = req.user._id;

    // Find the blog which the user wants to dislike
    const blog = await Blog.findById(blogId);

    // Check if the user has already disliked the blog
    const isDisLiked = blog.isDisliked;

    //Check if the user like the blog
    const isLiked = blog.likes.find(
      (userId) => userId.toString() === loginUserId.toString()
    );

    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        {
          new: true,
        }
      );
      res.status(200).json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      res.status(200).json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        {
          new: true,
        }
      );
      res.status(200).json(blog);
    }
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
  likeBlog,
  dislikeBlog,
};
