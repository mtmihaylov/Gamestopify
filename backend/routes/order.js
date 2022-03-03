const express = require('express');
const router = express.Router();

const { newOrder, getOrder, myOrders } = require('../controllers/orderController');

const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticated, newOrder);
router.route('/order/:id').get(isAuthenticated, getOrder);
router.route('/myprofile/orders').get(isAuthenticated, myOrders);

module.exports = router;