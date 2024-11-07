// models/bill.js

const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    amount: { 
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    payment_mode: {
        type: String, // e.g., 'credit_card', 'cash', 'paypal', etc.
        required: true,
    },
    discount: {
        type: Boolean,
        default: false, 
    },
    discountAmount: {
        type: Number,
        default: 0, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: 0,
    },
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
