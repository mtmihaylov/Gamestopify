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

// Get all orders in database on api/v1/admin/orders - FOR ADMINS
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

// Update / Process order on api/v1/admin/order/:id - FOR ADMINS
exports.updateOrder = catchAsyncErrors( async( req, res, next ) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler('This order has already been delivered', 400))
  }

  order.orderItems.forEach(async item => {  
    await updateStock(item.product, item.quantity)
  })

  order.orderStatus = req.body.orderStatus
  order.deliveryDate = Date.now()

  await order.save();

  res.status(200).json({
    success: true,
    order
  })
})

async function updateStock(id, quantity){
  const product = await Product.findById(id)

  product.stock = product.stock - quantity

  await product.save({ validateBeforeSave: false });
}

// Delete order on api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors( async( req, res, next ) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  })
})