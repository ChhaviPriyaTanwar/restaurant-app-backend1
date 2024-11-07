const mongoose = require('mongoose'); // Make sure this import is present
const favoriteService = require('../services/favoriteService');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');
const { v4: uuidv4 } = require('uuid');
const userService = require('../services/userService');



// Add a favorite item
const addFavorite = async (req, res) => {
    const { userId, menuItemId, isFavorite } = req.body;
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

        const slugId = uuidv4();

        const favorite = await favoriteService.addFavorite({
            slugId,
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

// Fetch a favorite item by userId and menuItemId
const getFavoritebyUserIdMenuItemId = async (req, res) => {
    const { userId, menuItemId } = req.query; // assuming query parameters for filtering
    try {
        // Validate input fields
        if (!userId || !menuItemId) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }

        const favorite = await favoriteService.getFavoriteByUserAndMenuItem(userId, menuItemId);

        if (!favorite) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.FAVORITE_NOT_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITE_FETCHED, favorite);
    } catch (error) {
        console.error("Error fetching favorite:", error.message);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITE_FETCH_FAILED, null);
    }
};


// Fetch a favorite item by userId and menuItemId
const getFavoritePopulateUserMenu = async (req, res) => {
    const { userId, menuItemId } = req.query; // assuming query parameters for filtering
    try {
        // Validate input fields
        if (!userId || !menuItemId) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }

        const favorite = await favoriteService.getFavoritePopulateUserMenu(userId, menuItemId);

        if (!favorite) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.FAVORITE_NOT_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITE_FETCHED, favorite);
    } catch (error) {
        console.error("Error fetching favorite:", error.message);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITE_FETCH_FAILED, null);
    }
};

// Fetch all favorite items
const getAllFavorites = async (req, res) => {
    try {
        // Fetch all favorite items by calling the service function
        const favorites = await favoriteService.getAllFavorites();

        if (favorites.length === 0) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.FAVORITES_NOT_FOUND, null);
        }

        // Return the list of favorite items
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITES_RETRIEVED, favorites);
    } catch (error) {
        console.error("Error fetching all favorites:", error.message);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITES_FETCH_FAILED, null);
    }
};

// Fetch all favorite items by userId
// get favorite by compelte details of particular user id with showing all menu details (too many)
const getFavoritesByUserId = async (req, res) => {
    const { userId } = req.query; // assuming userId is passed as a query parameter
    try {
        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.USER_NOT_FOUND, null);
        }

        // Check if userId exists in the database
        const user = await userService.getUserById(userId);
        if (!user) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.USER_NOT_FOUND, null);
        }

        // Fetch favorites for the user
        const favorites = await favoriteService.getFavoritesByUserId(userId);

        if (favorites.length === 0) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.FAVORITE_NOT_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITES_RETRIEVED, favorites);
    } catch (error) {
        console.error("Error fetching favorites by userId:", error.message);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITES_RETRIEVE_FAILED, null);
    }
};

// Update a favorite item
const updateFavorite = async (req, res) => {
    const { id, isFavorite } = req.body;
    try {
        // Validate input fields
        if (!id || isFavorite === undefined) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }
        // Update the favorite
        const updatedFavorite = await favoriteService.updateFavorite(id, {
            isFavorite,
            updatedAt: Math.floor(Date.now() / 1000),
        });

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITE_UPDATED, updatedFavorite);
    } catch (error) {
        console.error("Error updating favorite:", error.message);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITE_UPDATED_FAILED, null);
    }
};

// Delete a favorite item
const deleteFavorite = async (req, res) => {
    const { favoriteId } = req.params;
    try {
        const deletedFavorite = await favoriteService.deleteFavorite(favoriteId);
        if (!deletedFavorite) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.FAVORITE_NOT_FOUND, null);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITE_DELETED, null);
    } catch (error) {
        console.error("Error deleting favorite:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITE_DELETION_FAILED, null);
    }
};

// Clear all favorites for a user
const clearFavorites = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.USER_NOT_FOUND, null);
        }
        await favoriteService.clearUserFavorites(userId);
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FAVORITES_CLEARED, null);
    } catch (error) {
        console.error("Error clearing favorites:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FAVORITES_CLEAR_FAILED, null);
    }
};

module.exports = {
    addFavorite,
    getAllFavorites,
    getFavoritebyUserIdMenuItemId,
    getFavoritePopulateUserMenu,
    getFavoritesByUserId,
    updateFavorite,
    deleteFavorite,
    clearFavorites,
};
