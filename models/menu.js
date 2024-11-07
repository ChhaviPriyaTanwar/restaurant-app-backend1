const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    slugId: { 
        type: String, 
        unique: true 
    },
    name: {
        type: String,
        require: true,     
    },
    description: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    categoryId: {
        type: String,
        ref: 'Category',
        require: true,
    },    
    image: {
        type: String,
    },
    createdAt: {
        type: Number,
    },
    updatedAt: {
        type: Number,
    }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
