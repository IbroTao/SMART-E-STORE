const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const accessToken = await jwt.verify(token, process.env.SECRET);
      const user = await User.findById(accessToken.id);
      req.user = user;
      next();
    } else res.status(401).json("Token invalid or expired. Try logging in");
  } catch (error) {
    throw new Error("There is no token attached to the header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("You are not an admin");
  } else {
    next();
  }
});

module.exports = {
  authMiddleware,
  isAdmin,
};
