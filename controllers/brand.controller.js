const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(200).json({ brand: brand });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!brand) return res.status(404).json({ message: "Brand not found!" });

    res.status(200).json({ brand: brand });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find().sort({
      createdAt: "desc",
    });
    if (!brands) return res.status(404).json({ message: "Brands not found!" });

    res.status(200).json({ brands: brands });
  } catch (error) {
    throw new Error(error);
  }
});

const getBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ message: "Brand not found!" });

    res.status(200).json({ brand: brand });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
};
