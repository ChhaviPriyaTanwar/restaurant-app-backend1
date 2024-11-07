const express = require('express');
const { createMenuItem, getMenuItems, getMenuItemById, updateMenuItem, deleteMenuItem, getPaginatedMenu, getPaginatedMenuOrder, uploadImage, getMenuCategoryItemById, getAllMenuCategoryItems, getSimpleAllMenuCategoryItems, getAllPopulateMenuCategoryItems, getMenuItemBySlugId, } = require('../controllers/menuController');
const { validateMenu, validateUpdateMenu } = require('../validations/validation');
const upload = require('../config/imageConfig');

const router = express.Router();

router.post('/', createMenuItem);
router.get('/', getMenuItems);
router.get('/all', getAllMenuCategoryItems);
router.get('/all/list', getSimpleAllMenuCategoryItems);
router.get('/:id', getMenuItemById);
router.get('/slugId/:slugId', getMenuItemBySlugId);
router.get('/category/:id', getMenuCategoryItemById);
router.put('/', validateUpdateMenu, updateMenuItem); 
router.delete('/:id', deleteMenuItem);
router.get('/get/page', getPaginatedMenu);
router.get('/get/page-order', getPaginatedMenuOrder);
router.post('/upload', upload.single('imageUrl'), uploadImage);


module.exports = router;
