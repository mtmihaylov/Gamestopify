const Order = require('../models/orders');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Create a new order on api/v1/order
exports.newOrder = catchAsyncErrors( async( req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo
  } = req.body

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paymentDate: Date.now(),
    user: req.user._id
  });

  res.status(200).json({
    success: true,
    order
  })
})

// Get single order on api/v1/order/:id
exports.getOrder = catchAsyncErrors( async( req, res, next ) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    order
  })
})

// Get logged in user orders on api/v1/myprofile/orders
exports.myOrders = catchAsyncErrors( async( req, res, next ) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders
  })
})

// Get all orders in database on api/v1/admin/orders
exports.getAllOrders = catchAsyncErrors( async( req, res, next ) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach(order => {
    totalAmount += order.itemsPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders
  })
})