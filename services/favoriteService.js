const Favorite = require('../models/favorite');

// Check if a favorite item already exists using countDocuments
const findFavorite = async ({ userId, menuItemId }) => {
    const count = await Favorite.countDocuments({ userId, menuItemId });
    return count > 0; // Return true if a matching document exists
};


const addFavorite = async (favoriteData) => {
    const favorite = new Favorite.create(favoriteData);
    return favorite;
};


const getFavoritesByUserId = async (userId) => {
    try {
        return await Favorite.find({ userId }).populate('menuItemId');
    } catch (error) {
        throw new Error(`Failed to retrieve favorites: ${error.message}`);
    }
};

const deleteFavorite = async (favoriteId) => {
    try {
        return await Favorite.findByIdAndDelete(favoriteId);
    } catch (error) {
        throw new Error(`Failed to delete favorite: ${error.message}`);
    }
};

const clearUserFavorites = async (userId) => {
    try {
        await Favorite.deleteMany({ userId });
    } catch (error) {
        throw new Error(`Failed to clear favorites: ${error.message}`);
    }
};

module.exports = {
    addFavorite,
    findFavorite,
    getFavoritesByUserId,
    deleteFavorite,
    clearUserFavorites,
};
