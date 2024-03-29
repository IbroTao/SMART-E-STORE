const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const { generateToken } = require("../configs/jwtToken");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../configs/refreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { hashSync, compareSync } = require("bcrypt");
const nodemailer = require("nodemailer");
const uniqid = require("uniqid");
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

// LOGIN AN ADMIN
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // CHECK IF NEW ADMIN EXISTS
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorized!");
  if (!findAdmin) return res.status(404).json({ message: "Admin not found!" });

  const comparePassword = compareSync(password, findAdmin.password);
  if (!comparePassword)
    return res.status(400).json({ message: "Invalid Credentials!" });

  const refreshToken = generateRefreshToken(findAdmin._id);
  const updatedAdmin = await User.findByIdAndUpdate(
    findAdmin.id,
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
    _id: findAdmin?._id,
    firstname: findAdmin?.firstname,
    lastname: findAdmin?.lastname,
    email: findAdmin?.email,
    mobile: findAdmin?.mobile,
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

// SAVE USER ADDRESS
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req.body.address,
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

// GET USER WISHLIST
const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.status(200).json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// USER CART
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);

    // Check if the user has products in the cart already
    const alreadyExistCart = await Cart.findOne({ orderBy: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user._id,
    }).save();
    res.status(200).json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderBy: _id }).populate(
      "products.product"
    );
    if (!cart)
      return res.status(400).json({ message: "This user has no cart" });

    res.status(200).json({ cart: cart });
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderBy: user._id });
    res.status(200).json({ mesage: "Cart emptied!" });
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
      throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let { products, cartTotal } = await Cart.findOne({
      orderBy: user._id,
    }).populate("products.product");
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderBy: user._id },
      { totalAfterDiscount },
      { new: true }
    );
    res.status(200).json(totalAfterDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  try {
    if (!COD) throw new Error("Create cash order failed!");
    const user = await User.findById({ _id });
    let userCart = await Cart.findOne({ orderBy: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "NGN",
      },
      orderBy: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: {
            _id: item.product._id,
          },
          update: {
            $inc: {
              quantity: -item.count,
              sold: +item.count,
            },
          },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const orders = await Order.findOne({ orderBy: _id });
    if (!orders) return res.status(404).json({ message: "Orders not found" });
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
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
};
