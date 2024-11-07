// services/billService.js

const Bill = require('../models/bill');
const Order = require('../models/order');

const createBill = async ({ orderId, userId, payment_mode, discount }) => {
    try {
        const order = await Order.findById(orderId); // Get the order details
        if (!order) throw new Error("Order is not found");

        const amount = parseFloat(order.totalPrice.toFixed(2)); // Original price
        const discountAmount = discount ? parseFloat((0.1 * amount).toFixed(2)) : 0; // 10% discount if true
        const totalPrice = parseFloat((amount - discountAmount).toFixed(2)); // Final price after discount

        const billData = {
            orderId,
            userId,
            amount,        // Original price
            totalPrice,    // Discounted price
            payment_mode,
            discount,
            discountAmount,
        };

        const bill = new Bill(billData);
        await bill.save();
        return bill;
    } catch (error) {
        throw new Error(`Failed to create bill: ${error.message}`);
    }
};

// Retrieve all bills
const getAllBills = async () => {
    return await Bill.find().populate('orderId');
};

// Retrieve a specific bill by ID
const getBillById = async (billId) => {
    return await Bill.findById(billId).populate('orderId');
};

// Retrieve a specific bill by ID
// const getBillById = async (billId) => {
//     return await Bill.findById(billId).populate('orderId userId');
// };

// Update a bill
const updateBill = async (billId, updateData) => {
    return await Bill.findByIdAndUpdate(billId, updateData, { new: true }).populate('orderId');
};

// Delete a bill
const deleteBill = async (billId) => {
    return await Bill.findByIdAndDelete(billId);
};

module.exports = {
    createBill,
    getAllBills,
    getBillById,
    updateBill,
    deleteBill,
};
