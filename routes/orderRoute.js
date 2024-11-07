const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Add a new order
router.post('/', orderController.addOrder);

// Get all orders for a user
router.get('/:userId', orderController.getOrdersByUserId);

// Update an order
router.put('/:orderId', orderController.updateOrder);

// Remove an order
router.delete('/:orderId', orderController.removeOrder);

module.exports = router;
