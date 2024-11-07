// models/bill.js

const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: { // Original price before discount
        type: Number,
        required: true,
    },
    totalPrice: { // Final price after discount
        type: Number,
        required: true,
    },
    payment_mode: {
        type: String, // e.g., 'credit_card', 'cash', 'paypal', etc.
        required: true,
    },
    discount: {
        type: Boolean,
        default: false, // Default to false, no discount
    },
    discountAmount: {
        type: Number,
        default: 0, // Amount of discount if applicable
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
