const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(200).json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({
      createdAt: "desc",
    });
    res.status(200).json({ coupons: coupons });
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!coupon) return res.status(404).json({ message: "Coupon not found!" });

    res
      .status(200)
      .json({ message: "Coupon updated successfully", coupon: coupon });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
