const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require('../utils/apiFeatures');

// Create new product => api/v1/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products on /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const productsPerPage = 1;
  const allProductsCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
                      .search()
                      .filter()
                      .pagination(productsPerPage)

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    allProductsCount,
    products,
  });
});

// Get product details on /api/v1/product/:id
exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update product details on /api/v1/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler("Product not found", 404));
  }
});

// Delete product on /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    return next(new ErrorHandler("Product not found", 404));
  }
});
