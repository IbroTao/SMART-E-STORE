const User = require("../models/userModel");
const { generateToken } = require("../configs/jwtToken");
const asyncHandler = require("express-async-handler");

// CREATE A NEW USER
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

// LOGIN A USER
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // CHECK IF NEW USER EXISTS
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// UPDATE A USER
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.email,
      },
      {
        new: true,
      }
    );
    res.status(200).json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// GET ALL USERS
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    throw new Error(error);
  }
});

// GET A SINGLE USER
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// DELETE A USER
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {}
});

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
};
