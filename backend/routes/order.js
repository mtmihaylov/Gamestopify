const express = require('express');
const router = express.Router();

const { newOrder, getOrder, myOrders, getAllOrders } = require('../controllers/orderController');

const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticated, newOrder);
router.route('/order/:id').get(isAuthenticated, getOrder);
router.route('/myprofile/orders').get(isAuthenticated, myOrders);
router.route('/admin/orders').get(isAuthenticated, authorizeRoles('admin'), getAllOrders)

module.exports = router;