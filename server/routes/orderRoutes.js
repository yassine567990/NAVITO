const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrderById, getOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/', protect, admin, getOrders);

module.exports = router;
