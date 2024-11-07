const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    slugId: { 
        type: String, 
        unique: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu', 
        required: true,
    },
    isFavorite: {
        type: Boolean,
        default: false, 
    },
    createdAt: {
        type: Number,
    },
    updatedAt: {
        type: Number,
    },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
