const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

//User Management Routes
router.get("/", protect, adminOnly, getUsers);  //Get all users (Admin only)
router.post("/", protect, adminOnly, createUser);
router.get("/:id", protect, getUserById);  //Get a specific user
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;