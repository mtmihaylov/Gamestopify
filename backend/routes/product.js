const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProduct,
  newProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
} = require("../controllers/productController");

const { isAuthenticated, authorizeRoles } = require('../middlewares/auth')

router.route("/products").get(getProducts);
router.route("/product/:id").get(getProduct);

router.route("/admin/product/new").post(isAuthenticated, authorizeRoles("admin"), newProduct);
router.route("/admin/product/:id")
      .put(isAuthenticated, authorizeRoles("admin"), updateProduct)
      .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);

router.route("/review").put(isAuthenticated, createReview)
router.route("/reviews").get(getReviews)

module.exports = router;
