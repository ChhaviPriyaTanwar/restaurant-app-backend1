const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    slugId: { 
        type: String, 
        unique: true 
    },
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    createdAt: {
        type: Number,
    },
    updatedAt: {
        type: Number,
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
