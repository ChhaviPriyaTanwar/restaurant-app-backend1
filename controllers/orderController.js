const Order = require('../models/order');
const Cart = require('../models/cart');
const Menu = require('../models/menu');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');

// Add a new order
const addOrder = async (req, res) => {
    try {
        const { userId } = req.body; // User ID from request body

        // Retrieve the cart items for the user
        const cartItems = await Cart.find({ userId }).populate('menuItemId');

        if (!cartItems.length) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, "Cart is empty.");
        }

        // Initialize total price
        let totalPrice = 0;

        // Create order items array from cart items and calculate total price
        const items = cartItems.map(cartItem => {
            const price = cartItem.menuItemId.price; // Get the price of the menu item
            const quantity = cartItem.quantity;

            // Calculate the total price for this item
            totalPrice += price * quantity;

            return {
                menuItemId: cartItem.menuItemId,
                quantity: quantity
            };
        });

        // Create the order with totalPrice
        const order = new Order({ userId, items, totalPrice });
        await order.save();

        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.ORDER_CREATED, order);
    } catch (error) {
        console.error("Error creating order:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.ORDER_CREATION_FAILED, error.message);
    }
};


// Get all orders for a specific user
const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).populate('items.menuItemId');

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.ORDERS_RETRIEVED, orders);
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.ORDER_RETRIEVAL_FAILED, error.message);
    }
};

// Update an order
const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const orderUpdates = req.body; // Get the updates from request body

        const updatedOrder = await Order.findByIdAndUpdate(orderId, orderUpdates, { new: true });

        if (!updatedOrder) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.ORDER_NOT_FOUND);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.ORDER_UPDATED, updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.ORDER_UPDATE_FAILED, error.message);
    }
};

// Remove an order
const removeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.ORDER_NOT_FOUND);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.ORDER_REMOVED, deletedOrder);
    } catch (error) {
        console.error("Error removing order:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.ORDER_REMOVAL_FAILED, error.message);
    }
};

module.exports = {
    addOrder,
    getOrdersByUserId,
    updateOrder,
    removeOrder,
};
