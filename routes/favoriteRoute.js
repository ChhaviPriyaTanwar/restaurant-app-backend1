const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const router = express.Router();

// Add a favorite
router.post('/', favoriteController.addFavorite);

// Get all favorites for a user
router.get('/:userId', favoriteController.getFavorites);

// Delete a favorite by ID
router.delete('/:favoriteId', favoriteController.deleteFavorite);

// Clear all favorites for a user
router.delete('/clear/:userId', favoriteController.clearFavorites);

module.exports = router;
