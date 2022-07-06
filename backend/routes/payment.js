const express = require("express");
const router = express.Router();

const {
  processPayment,
  sendApiKey,
} = require("../controllers/paymentController");

const { isAuthenticated } = require("../middlewares/auth");

router.route("/payment/process").post(isAuthenticated, processPayment);

router.route("/stripe").get(isAuthenticated, sendApiKey);

module.exports = router;
