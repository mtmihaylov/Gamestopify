const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  resetPasswordRequest,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

router.route("/password/reset").post(resetPasswordRequest);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticated, updatePassword);

router.route("/myprofile").get(isAuthenticated, getUserProfile);
router.route("/myprofile/update").put(isAuthenticated, updateProfile);

router.route('/admin/users').get(isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.route('/admin/user/:id')
      .get(isAuthenticated, authorizeRoles("admin"), getUserDetails)
      .put(isAuthenticated, authorizeRoles("admin"), updateUser)
      .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);


module.exports = router;
