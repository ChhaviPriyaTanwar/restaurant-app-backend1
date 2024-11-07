// models/order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: 'User',
        required: true
    },
    items: [
        {
            menuItemId: {
                // type: mongoose.Schema.Types.ObjectId,
                type: String,
                ref: 'Menu',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    },
    
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
