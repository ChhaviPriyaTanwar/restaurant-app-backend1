const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.get('/all', cartController.getAllCartList);
router.get('/all/list', cartController.getAllCartDetailsList);
router.get('/slugId/:slugId', cartController.getCartBySlugId);
router.get('/user/menu/:slugId', cartController.getCartWithUserMenuBySlugId);
router.get('/userId/:userId', cartController.getCartByUserId);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:slugId', cartController.removeCartItem);

module.exports = router;
