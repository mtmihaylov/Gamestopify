const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, resetPasswordRequest, resetPassword } = require('../controllers/userController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/password/reset').post(resetPasswordRequest);
router.route('/password/reset/:token').put(resetPassword);

module.exports = router;