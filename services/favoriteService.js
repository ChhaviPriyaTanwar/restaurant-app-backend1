const Favorite = require('../models/favorite');

// Check if a favorite item already exists using countDocuments
const findFavorite = async ({ userId, menuItemId }) => {
    const count = await Favorite.countDocuments({ userId, menuItemId });
    return count > 0; 
};


const addFavorite = async (favoriteData) => {
    const favorite = new Favorite(favoriteData);
    await favorite.save();
    return favorite;
};

//fetch data by userId and menuItemId
const getFavoriteByUserAndMenuItem = async (userId, menuItemId) => {
    return await Favorite.findOne({ userId, menuItemId }).exec(); // exec use for execute query
};

// Fetch data by userId and menuItemId with populated user and menu information
const getFavoritePopulateUserMenu = async (userId, menuItemId) => {
    return await Favorite.findOne({ userId, menuItemId })
        .populate('userId', 'name email phone')   // Fetch user details (choose specific fields if desired)
        .populate('menuItemId', 'name description price')  // Fetch menu details (choose specific fields if desired)
        .exec();
};

// Fetch all favorite items from the database
const getAllFavorites = async () => {
    try {
        // Fetch all favorites and populate associated user and menu items
        return await Favorite.find()
            .populate('userId', 'name email')  // Populate user details (you can adjust fields)
            .populate('menuItemId', 'name price description') // Populate menu item details (you can adjust fields)
            .exec();
    } catch (error) {
        console.error("Error fetching all favorites:", error.message);
        throw new Error("Error fetching all favorites");
    }
};

const getFavoritesByUserId = async (userId) => {
        return await Favorite.find({ userId }).populate('menuItemId');    
};

const updateFavorite = async (id, updateData) => {
    return await Favorite.findByIdAndUpdate(id, updateData, { new: true });
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
    updateFavorite,
    findFavorite,
    getAllFavorites,
    getFavoriteByUserAndMenuItem,
    getFavoritePopulateUserMenu,
    getFavoritesByUserId,
    deleteFavorite,
    clearUserFavorites,
};

