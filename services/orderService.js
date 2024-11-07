const Order = require('../models/order');
const Menu = require('../models/menu'); // Assuming you have a Menu model
const { MESSAGE } = require('../utils/constants');

// Create a new order
const createOrder = async ({ userId, items }) => {
    const totalPrice = await calculateTotalPrice(items);
    const order = new Order({ userId, items, totalPrice });
    await order.save();
    return order;
};

// Calculate total price based on the items ordered
const calculateTotalPrice = async (items) => {
    let totalPrice = 0;
    for (const item of items) {
        const menuItem = await Menu.findById(item.menuItemId);
        if (menuItem) {
            totalPrice += menuItem.price * item.quantity;
        }
    }
    return totalPrice;
};

// Retrieve all orders for a specific user
const getOrdersByUserId = async (userId) => {
    return await Order.find({ userId }).populate('items.menuItemId');
};

// Update an existing order
const updateOrder = async (orderId, updateData) => {
    return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
};

// Remove an order
const removeOrder = async (orderId) => {
    return await Order.findByIdAndDelete(orderId);
};

module.exports = {
    createOrder,
    getOrdersByUserId,
    updateOrder,
    removeOrder,
};
