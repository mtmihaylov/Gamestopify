const Product = require('../models/product');

// Create ne product => api/v1/product/new
exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  })
}

// Get all products on /api/v1/products
exports.getProducts = async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products
  })
}

// Get product details on /api/v1/product/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    // return?
    res.status(404).json({ success: false, message: "Product not found" })
  }
}

// Update product details on /api/v1/product/:id
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    // return?
    res.status(404).json({ success: false, message: "Product not found" })
  }
}

// Delete product on /api/v1/admin/product/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted"
    })
  } catch (error) {
    // return?
    res.status(404).json({ success: false, message: "Product not found" })
  }
}