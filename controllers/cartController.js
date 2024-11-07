const Cart = require('../models/cart');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');
const userService = require('../services/userService');
const cartService = require('../services/cartService');
const menuService = require('../services/menuService');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Add item to cart
const addToCart = async (req, res) => {
    const { userId, menuItemId, quantity } = req.body;
    try {

        // Validate input fields
        if (!userId || !menuItemId || !quantity) {
            logger.warn(`Cart creation failed: Required fields are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }

        // Ensure quantity is at least 1
        if (quantity < 1) {
            logger.warn(`Invalid quantity: Quantity must be at least 1`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.INVALID_QUANTITY, null);
        }

        // Check if user exists
        const user = await userService.getUserBySlugId(userId);
        if (!user) {
            logger.warn(`User not found with ID: ${user}`);
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.USER_NOT_FOUND, null);
        }

        // Check if the menu item exists
        const menuItem = await menuService.getMenuItemBySlugId(menuItemId);
        if (!menuItem) {
            logger.warn(`Menu not found with ID: ${menuItem}`);
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.MENU_ITEM_NOT_FOUND, null);
        }

        const slugId = uuidv4();

        const cartData = { 
            slugId,
            userId: user.slugId, 
            menuItemId: menuItem.slugId, 
            menu:menuItem,
            quantity,
            createdAt: Math.floor(Date.now() / 1000),
            updatedAt: 0
         };

        const cartItem = await cartService.addCartItem(cartData);     
        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.CART_ITEM_ADDED, cartItem);
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CART_ITEM_ADD_FAILED, null);
    }
};

// Get Cart By SlugId
const getCartBySlugId = async (req, res) => {
    const { slugId } = req.params;

    try {
        const cartItem = await cartService.getCartBySlugId(slugId);
        if (!cartItem) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.CART_ITEM_NOT_FOUND, null);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CART_ITEMS_RETRIEVED, cartItem);
    } catch (error) {
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEM_FETCH_FAILED, null);
    }
};

// Get all menu API
const getAllCartList = async (req, res) => {
    try {
        const carts = await cartService.getAllCartList();
        console.log("carts");
        console.log(carts);

        if (carts.length === 0) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.NO_DATA_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CART_ITEMS_RETRIEVED, carts);
    } catch (error) {
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CART_ITEMS_RETRIEVE_FAILED, null);
    }
};


// Get all cart with user and menu details
const getAllCartDetailsList = async (req, res) => {
    try {
        const cartItem = await cartService.getAllCartList();  

        if (cartItem.length === 0) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.NO_DATA_FOUND, null);
        }

        console.log("cartItem");
        console.log(cartItem);

        for (let i = 0; i < cartItem.length; i++) {
            const item = cartItem[i];

            const user = await userService.getUserBySlugId(item.userId);
            const menu = await menuService.getMenuItemBySlugId(item.menuItemId);

            if (user && menu) {
                cartItem[i] = {
                    ...item.toObject(),
                    user: {
                        _id: user._id,
                        slugId: user.slugId,
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    },
                    menu: {
                        _id: menu._id,
                        slugId: menu.slugId,
                        name: menu.name,
                        description: menu.description,
                        price: menu.price
                    }
                };
            } else {
                cartItem[i] = {
                    ...item.toObject(),
                    category: null,
                    menu: null
                };
            }
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CART_ITEMS_RETRIEVED, cartItem);
    } catch (error) {
        logger.error(`Failed to retrieve cart items and user,menu: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CART_ITEMS_RETRIEVE_FAILED, null);
    }
};

// Get menu item and its category by menu item ID
const getCartWithUserMenuBySlugId = async (req, res) => {
    const { slugId } = req.params;

    try {
        const cartItem = await cartService.getCartBySlugId(slugId);
        if (!cartItem) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.CART_ITEM_NOT_FOUND, null);
        }
        console.log(`cartItem : ${cartItem}`);

        const user = await userService.getUserBySlugId(cartItem.userId);
        if (!user) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.USER_NOT_FOUND, null);
        }

        const menu = await menuService.getMenuItemBySlugId(cartItem.menuItemId);
        if (!menu) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.MENU_ITEM_NOT_FOUND, null);
        }

        const responseData = {
            ...cartItem.toObject(),
            user: {
                _id: user._id,
                slugId: user.slugId,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            menu: {
                _id: menu._id,
                slugId: menu.slugId,
                name: menu.name,
                description: menu.description,
                price: menu.price
            }
        };

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_ITEM_FETCHED, responseData);
    } catch (error) {
        logger.error(`Failed to retrieve menu item and category: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEM_FETCH_FAILED, null);
    }
};

// Get all items in cart for a specific user id -error
const getCartByUserId = async (req, res) => {
    const { userId } = req.params;  // This is the userId in UUID format
    try {
        // Fetch cart items by userId
        const cartItems = await cartService.getCartByUserId(userId);

        if (cartItems.length === 0) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.NO_DATA_FOUND, null);
        }

        // Fetch user details using the userId (UUID)
        const user = await userService.getUserBySlugId(userId);
        if (!user) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.USER_NOT_FOUND, null);
        }

        // Process cart items to include menu and user details
        const populatedCartItems = await Promise.all(
            cartItems.map(async (cartItem) => {
                // Fetch menu details using menuItemId (UUID)
                const menu = await menuService.getMenuItemBySlugId(cartItem.menuItemId);

                return {
                    ...cartItem.toObject(),
                    user: {
                        _id: user._id,
                        slugId: user.slugId,
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    },
                    menu: menu ? {
                        _id: menu._id,
                        slugId: menu.slugId,
                        name: menu.name,
                        description: menu.description,
                        price: menu.price
                    } : null
                };
            })
        );

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CART_ITEMS_RETRIEVED, populatedCartItems);
    } catch (error) {
        console.error("Error retrieving cart items:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CART_ITEMS_RETRIEVE_FAILED, null);
    }
};


// Update cart item quantity
const updateCartItem = async (req, res) => {
    const { slugId, quantity } = req.body;
    try {

        // Check for required ID
        if (!slugId) {
            logger.warn(`Required field 'id' is missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ID_REQUIRED, null);
        }

        // Check if menu exists by ID
        const existingCart = await cartService.getCartBySlugId(slugId);
        if (!existingCart) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.CART_ITEM_NOT_FOUND, null);
        }

        const updatedCartItemData = {
            quantity,
            updatedAt: Math.floor(Date.now() / 1000)
        };

        // Check if the cart item exists
        const cartItem = await cartService.updateCartItem(slugId, updatedCartItemData);      
       
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CART_ITEM_UPDATED, cartItem);
    } catch (error) {
        console.error("Error updating cart item:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CART_ITEM_UPDATE_FAILED, null);
    }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
    const { slugId } = req.params;
    try {

        // Validate the presence of the ID
        if (!slugId) {
            logger.warn(`Required field 'id' is missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ID_REQUIRED,null);
        }

        // Check if the cart item exists
        const cartItem = await cartService.getCartBySlugId(slugId);
        if (!cartItem) {
            logger.warn(`Delete failed: Cart not found with ID: ${slugId}`);
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.CART_ITEM_NOT_FOUND,null);
        }

        await cartService.deleteCartItem(slugId);

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CART_ITEM_REMOVED, null);
    } catch (error) {
        console.error("Error removing cart item:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CART_ITEM_REMOVE_FAILED, null);
    }
};

module.exports = {
    addToCart,
    getCartBySlugId,
    getAllCartList,
    getAllCartDetailsList,
    getCartByUserId,
    getCartWithUserMenuBySlugId,
    updateCartItem,
    removeCartItem,
};
