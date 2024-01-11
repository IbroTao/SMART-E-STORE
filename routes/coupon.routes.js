const { Router } = require("express");
const router = Router();

const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon.controller");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
