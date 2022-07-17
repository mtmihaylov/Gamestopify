const { Product, productSchema } = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// Create new product => api/v1/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesObjects = [];

  for (const image of images) {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "products",
    });

    imagesObjects.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesObjects;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products on /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const productsPerPage = 4;
  const allProductsCount = await Product.countDocuments();
  const categories = productSchema.path("category").enumValues;

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();
  //.pagination(productsPerPage);

  let products = await apiFeatures.query;
  const filteredProductsCount = products.length;

  apiFeatures.pagination(productsPerPage);
  products = await apiFeatures.query.clone();

  res.status(200).json({
    success: true,
    allProductsCount,
    products,
    productsPerPage,
    categories,
    filteredProductsCount,
  });
});

// Get all products for admin dashboard on /api/v1/admin/products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
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
    let product = await Product.findById(req.params.id);

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images !== undefined) {
      // Delete product images in cloudinary
      for (const image of product.images) {
        const result = await cloudinary.v2.uploader.destroy(image.public_id);
      }

      let imagesObjects = [];

      for (const image of images) {
        const result = await cloudinary.v2.uploader.upload(image, {
          folder: "products",
        });

        imagesObjects.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = imagesObjects;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
    const product = await Product.findById(req.params.id);

    // Delete product images in cloudinary
    for (const image of product.images) {
      const result = await cloudinary.v2.uploader.destroy(image.public_id);
    }

    // Delete product
    await product.remove();

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    return next(new ErrorHandler("Product not found", 404));
  }
});

// Create / Update review on api/v1/review
exports.createReview = catchAsyncErrors(async (req, res, next) => {
  // TODO: Make it with req.query.id?
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    avatar: req.user.avatar.url,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find((r) => {
    return r.user.toString() === req.user._id.toString();
  });

  if (isReviewed) {
    product.reviews.forEach((r) => {
      if (r.user.toString() === req.user._id.toString()) {
        r.comment = comment;
        r.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, review) => review.rating + acc, 0) /
    product.reviews.length;

  product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get product reviews on api/v1/reviews
exports.getReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete product review on api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product.reviews.filter(
    (r) => r._id.toString() !== req.query.reviewId.toString()
  );

  const numberOfReviews = reviews.length;

  const ratings =
    product.reviews.reduce((acc, review) => review.rating + acc, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
