const { Router } = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all", getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.put("/edit", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
