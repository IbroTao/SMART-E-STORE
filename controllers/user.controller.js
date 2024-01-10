const User = require("../models/userModel");
const { generateToken } = require("../configs/jwtToken");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../configs/refreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { hashSync, compareSync } = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

const sender = process.env.SENDER;
const emailAccess = process.env.PASS;

// CREATE A NEW USER
const createUser = asyncHandler(async (req, res) => {
  const { email, firstname, lastname, mobile, password } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    // CREATE A NEW USER
    const user = await User.create({
      firstname,
      lastname,
      email,
      mobile,
      password: hashSync(password, 10),
    });
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
  if (!findUser) return res.status(404).json({ message: "User not found!" });

  const comparePassword = compareSync(password, findUser.password);
  if (!comparePassword)
    return res.status(400).json({ message: "Invalid Credentials!" });

  const refreshToken = generateRefreshToken(findUser._id);
  const updatedUser = await User.findByIdAndUpdate(
    findUser.id,
    {
      refreshToken: refreshToken,
    },
    {
      new: true,
    }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });
  res.status(200).json({
    _id: findUser?._id,
    firstname: findUser?.firstname,
    lastname: findUser?.lastname,
    email: findUser?.email,
    mobile: findUser?.mobile,
  });
});

// HANDLE REFRESH TOKEN
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token present or Token ");
  jwt.verify(refreshToken, process.env.SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user._id);
    res.status(200).json({
      accessToken,
    });
  });
});

// LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // Forbidden
  }
  const logout = await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // Forbidden
});

// UPDATE A USER
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
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
    res.status(200).json(updatedUser);
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
  validateMongoDbId(id);
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
  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {}
});

// BLOCK USER
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "User blocked", user: user });
  } catch (error) {
    throw new Error(error);
  }
});

// UNBLOCK USER
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "User unblocked", user: user });
  } catch (error) {
    throw new Error(error);
  }
});

// FUNCTION TO GENERATE PASSWORD TOKEN
function generatePasswordResetToken() {
  return crypto.randomBytes(20).toString("hex");
}

// CONFIGURING EMAIL
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: sender,
    pass: emailAccess,
  },
});

function sendResetEmail(email, resetToken) {
  const resetLink = `http://localhost:5000/api/user/reset-password/${resetToken}`;
  const mailOptions = {
    from: sender,
    to: email,
    subject: "Reset Password Link",
    text: `<h2>Click here to reset your email: ${resetLink}</h2>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending reset email:", error);
    } else {
      console.log("Reset email sent:", info.response);
    }
  });
}

// FORGET PASSWORD TOKEN
const forgetPasswordToken = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = generatePasswordResetToken();
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = Date.now() + 30 * 60 * 100;
    const newUser = await user.save();

    sendResetEmail(email, resetToken);
    res.status(200).json({
      message: "Reset Email sent. Check your inbox",
      token: resetToken,
      user: newUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(404).json({ message: "Token expired!, Try again." });
    } else {
      user.password = hashSync(password, 12);
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      const newUser = await user.save();
      res
        .status(200)
        .json({ message: "Password reset successfully.", user: newUser });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  forgetPasswordToken,
  resetPassword,
};
