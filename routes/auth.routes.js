const { Router } = require("express");
const {
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
} = require("../controllers/user.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/forget-password-token", forgetPasswordToken);
router.post("/reset-password/:token", resetPassword);
router.post("/cart", authMiddleware, userCart);
router.get("/", getAllUsers);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/cart", authMiddleware, getUserCart);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.put("/edit", authMiddleware, isAdmin, updateUser);
router.put("/save-address", authMiddleware, isAdmin, saveAddress);
router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUser);

module.exports = router;
