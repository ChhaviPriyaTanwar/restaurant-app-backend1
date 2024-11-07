const express = require('express');
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
    getCategoryBySlugId,
} = require('../controllers/categoryController');
const { validateCategory } = require('../validations/validation'); 

const router = express.Router();

// Routes for categories
router.post('/', validateCategory, createCategory); 
router.get('/', getAllCategories); 
router.get('/:id', getCategoryById); 
router.get('/slugId/:slugId', getCategoryBySlugId); 
router.put('/', validateCategory, updateCategoryById); 
router.delete('/:id', deleteCategoryById); 

module.exports = router;
