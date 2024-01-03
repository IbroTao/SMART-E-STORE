const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    // CREATE A NEW USER
    const user = await User.create(req.body);
    res.status(201).json(user);
  } else {
    // USER ALREADY EXISTS
    throw new Error("User Already Exists!");
  }
});

module.exports = { createUser };
