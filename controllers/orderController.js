const Order = require('../models/order');
const Cart = require('../models/cart');
const Menu = require('../models/menu');
const User = require('../models/user');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');
const menuService = require('../services/menuService');


// Add a new order
const addOrder = async (req, res) => {
    let { userId } = req.body; // userId as a string (slugId)

    try {
        // Validate if the user exists (optional if you already validated elsewhere)
        const user = await User.findOne({ slugId: userId });  // Ensure `slugId` field is queried
        if (!user) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, "User not found.");
        }

        // Query Cart with string userId and string menuItemId
        const cartItems = await Cart.find({ userId });

        if (!cartItems.length) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, "Cart is empty.");
        }

        // Calculate total price and prepare order items
        let totalPrice = 0;
        const items = [];

        for (const cartItem of cartItems) {
            // Pass the cartItem.menuItemId directly to getMenuItemBySlugId
            const menuItem = await menuService.getMenuItemBySlugId(cartItem.menuItemId);
            console.log(`menuItem: ${menuItem}`);
            if (!menuItem || !menuItem.price) {
                // Handle the case where the menu item doesn't have a price
                console.error(`Menu item with ID ${cartItem.menuItemId} doesn't have a valid price.`);
                return responseHandler(res, STATUS_CODE.BAD_REQUEST, `Menu item with ID ${cartItem.menuItemId} doesn't have a valid price.`);
            }

            const price = menuItem.price;  // Get the price of the menu item
            const quantity = cartItem.quantity;

            totalPrice += price * quantity; // Safely calculate total price

            items.push({
                menuItemId: cartItem.menuItemId, // Storing `menuItemId` as string
                quantity
            });
        }

        // Check if totalPrice is valid
        if (isNaN(totalPrice) || totalPrice <= 0) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, "Invalid total price calculation.");
        }

        // Create the order with total price and items
        const order = new Order({
            // userId: user._id, 
            userId: user.slugId, 
            items, 
            totalPrice: totalPrice.toFixed(2)  // Ensure the total price is a valid number
        });
        await order.save();

        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.ORDER_CREATED, order);
    } catch (error) {
        console.error("Error creating order:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.ORDER_CREATION_FAILED, null);
    }
};

// Get all orders for a specific user
const getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch the orders based on userId
        const orders = await Order.find({ userId });

        // Loop through each order and manually fetch the Menu items
        const ordersWithMenuItems = await Promise.all(orders.map(async (order) => {
            const items = await Promise.all(order.items.map(async (item) => {
                // Fetch the Menu item by slugId (not by ObjectId)
                const menuItem = await Menu.findOne({ slugId: item.menuItemId });

                return {
                    ...item.toObject(),  // Convert item to a plain JavaScript object
                    menuItem: menuItem ? { 
                        slugId: menuItem.slugId,
                        name: menuItem.name,
                        price: menuItem.price,
                        description: menuItem.description
                    } : null  // If no menuItem is found, return null
                };
            }));

            return {
                ...order.toObject(),  // Convert order to a plain object
                items  // Add the updated items with menuItem info
            };
        }));

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.ORDERS_RETRIEVED, ordersWithMenuItems);
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.ORDER_RETRIEVAL_FAILED, error.message);
    }
};

// Update an order
const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const orderUpdates = req.body;
    try {

        const updatedOrder = await Order.findByIdAndUpdate(orderId, orderUpdates, { new: true });

        if (!updatedOrder) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.ORDER_NOT_FOUND);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.ORDER_UPDATED, {updatedOrder, updatedAt: Date.now});
    } catch (error) {
        console.error("Error updating order:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.ORDER_UPDATE_FAILED, error.message);
    }
};

// Remove an order
const removeOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        
        if (!deletedOrder) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.ORDER_NOT_FOUND);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.ORDER_REMOVED, null);
    } catch (error) {
        console.error("Error removing order:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.ORDER_REMOVAL_FAILED, error.message);
    }
};

module.exports = {
    addOrder,
    getOrdersByUserId,
    updateOrder,
    removeOrder,
};





















    // add order
    // const addOrder = async (req, res) => {
    //     const { userId } = req.body; // User ID from request body
    //     try {
    
    //         // Retrieve the cart items for the user
    //         const cartItems = await Cart.find({ userId }).populate('menuItemId');
    
    //         if (!cartItems.length) {
    //             return responseHandler(res, STATUS_CODE.BAD_REQUEST, "Cart is empty.");
    //         }
    
    //         // Initialize total price
    //         let totalPrice = 0;
    
    //         // Create order items array from cart items and calculate total price
    //         const items = cartItems.map(cartItem => {
    //             const price = cartItem.menuItemId.price; // Get the price of the menu item
    //             const quantity = cartItem.quantity;
    
    //             // Calculate the total price for this item
    //             totalPrice += price * quantity;
    
    //             return {
    //                 menuItemId: cartItem.menuItemId,
    //                 quantity: quantity
    //             };
    //         });
    
    //         // Create the order with totalPrice
    //         const order = new Order({ userId, items, totalPrice });
    //         await order.save();
    
    //         return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.ORDER_CREATED, order);
    //     } catch (error) {
    //         console.error("Error creating order:", error);
    //         return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.ORDER_CREATION_FAILED, error.message);
    //     }
    // };
    
    
    // Get all orders for a specific user
    // const getOrdersByUserId = async (req, res) => {
    //     const { userId } = req.params;
    //     try {
    //         const orders = await Order.find({ userId }).populate('items.menuItemId');
    
    //         return responseHandler(res, STATUS_CODE.OK, MESSAGE.ORDERS_RETRIEVED, orders);
    //     } catch (error) {
    //         console.error("Error retrieving orders:", error);
    //         return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.ORDER_RETRIEVAL_FAILED, error.message);
    //     }
    // };