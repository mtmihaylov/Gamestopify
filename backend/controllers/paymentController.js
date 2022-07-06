const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Process payments on /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

// Send stripe API key to client on /api/v1/stripe
exports.sendApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    apiKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
