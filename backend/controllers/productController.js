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
  const productsPerPage = 2;
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

// Create / Update review on api/v1/review 
exports.createReview = catchAsyncErrors( async( req, res, next) => {
  // TODO: Make it with req.query.id?
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(r => {
    r.user.toString() === req.user._id.toString()
  })

  if (isReviewed) {
    product.reviews.forEach(r => {
      if (r.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    })
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  product.ratings = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length

  product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  })
})

// Get product reviews on api/v1/reviews
exports.getReviews = catchAsyncErrors( async( req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

// Delete product review on api/v1/reviews
exports.deleteReview = catchAsyncErrors( async( req, res, next ) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product.reviews.filter(r => r._id.toString() !== req.query.reviewId.toString());

  const numberOfReviews = reviews.length;

  const ratings = product.reviews.reduce((acc, review) => review.rating + acc, 0) / reviews.length;

  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numberOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true
  })
})