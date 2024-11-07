const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    slugId: { 
        type: String, 
        unique: true 
    },    
    userId: {
        type: String,
        ref: 'User',
        require: true
     },
    menuItemId: {
        type: String,
        ref: 'Menu',
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Number,
    },
    updatedAt: {
        type: Number,
    },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
