const Cart = require('../models/cart');
const User = require('../models/user');
const Menu = require('../models/menu');

const addCartItem = async (cartItemData) => {
    const cartItem = new Cart(cartItemData);
    return await cartItem.save();
};

const getCartBySlugId = async (slugId) => {
    return await Cart.findOne( {slugId} );
};

const getAllCartList = async () => {
    return await Cart.find();
};

const getCartByUserId = async (userId) => {
    return await Cart.find({ userId });
};


const updateCartItem = async (slugId, updates) => {
    return await Cart.findOneAndUpdate({ slugId }, updates, { new: true });
};

const deleteCartItem = async (slugId) => {
    return await Cart.findOneAndDelete({ slugId });
};

module.exports = {
    addCartItem,
    getCartBySlugId,
    getAllCartList,
    getCartByUserId,
    updateCartItem,
    deleteCartItem,
};

//add, getByUserId, getBySlugId, getAllCart, update, delete
