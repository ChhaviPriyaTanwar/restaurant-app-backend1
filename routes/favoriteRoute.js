const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const router = express.Router();

// Add a favorite
router.post('/', favoriteController.addFavorite);

router.get('/user/menu', favoriteController.getFavoritebyUserIdMenuItemId);
router.get('/get/user/menu/', favoriteController.getFavoritePopulateUserMenu);
router.get('/all', favoriteController.getAllFavorites);


// Get all favorites for a user
router.get('/', favoriteController.getFavoritesByUserId);
router.put('/update', favoriteController.updateFavorite);

// Delete a favorite by ID
router.delete('/:favoriteId', favoriteController.deleteFavorite);

// Clear all favorites for a user
router.delete('/clear/:userId', favoriteController.clearFavorites);

module.exports = router;
