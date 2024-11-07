const favoriteService = require('../services/favoriteService');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');

// Add a favorite item
const addFavorite = async (req, res) => {
    const { userId, menuItemId, isFavorite} = req.body;
    try {
        // Validate input fields
        if (!userId || !menuItemId || !isFavorite) {
            logger.warn(`Favorite creation failed: Required fields are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }

         // Check if the favorite already exists
        const existingFavorite = await favoriteService.findFavorite({ userId, menuItemId });

         if (existingFavorite) {
             return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITE_ALREADY_EXISTS, existingFavorite);
         }
 

        const favorite = await favoriteService.addFavorite({
            userId, 
            menuItemId, 
            isFavorite, 
            createdAt: Math.floor(Date.now() / 1000),
            updatedAt: 0,
        });
        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.FAVORITE_ADDED, favorite);
    } catch (error) {
        console.error("Error adding favorite:", error.message);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITE_ADD_FAILED, null);
    }
};


// Get all favorites for a user
const getFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
        const favorites = await favoriteService.getFavoritesByUserId(userId);
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITES_RETRIEVED, favorites);
    } catch (error) {
        console.error("Error retrieving favorites:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITES_RETRIEVE_FAILED, error.message);
    }
};

// Delete a favorite item
const deleteFavorite = async (req, res) => {
    try {
        const { favoriteId } = req.params;
        const deletedFavorite = await favoriteService.deleteFavorite(favoriteId);
        if (!deletedFavorite) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.FAVORITE_NOT_FOUND);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITE_DELETED, deletedFavorite);
    } catch (error) {
        console.error("Error deleting favorite:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITE_DELETION_FAILED, error.message);
    }
};

// Clear all favorites for a user
const clearFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
        await favoriteService.clearUserFavorites(userId);
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITES_CLEARED);
    } catch (error) {
        console.error("Error clearing favorites:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITES_CLEAR_FAILED, error.message);
    }
};

module.exports = {
    addFavorite,
    getFavorites,
    deleteFavorite,
    clearFavorites,
};
