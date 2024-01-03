const { Router } = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");
const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all", getAllUsers);
router.get("/:id", getSingleUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
