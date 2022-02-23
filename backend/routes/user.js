const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
  resetPasswordRequest,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
} = require("../controllers/userController");

const { isAuthenticated } = require('../middlewares/auth');

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/reset").post(resetPasswordRequest);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticated, updatePassword);

router.route("/myprofile").get(isAuthenticated, getUserProfile);
router.route("/myprofile/update").put(isAuthenticated, updateProfile);

module.exports = router;
