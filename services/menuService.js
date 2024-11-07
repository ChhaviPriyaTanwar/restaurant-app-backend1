const Menu = require('../models/menu');

const createMenuItem = async (menuData) => {
    const menu = await Menu.create(menuData);
    return menu;
};

const getMenuItems = async () => {
    return await Menu.find();
};

const getMenuItemById = async (id) => {
    return await Menu.findById(id);
};

const getMenuItemBySlugId = async (slugId) => {
    return await Menu.findOne( {slugId} );
};

const updateMenuItem = async (id, menuData) => {
    return await Menu.findByIdAndUpdate(id, menuData, { new: true });
};

const deleteMenuItem = async (id) => {
    return await Menu.findByIdAndDelete(id);
};

// Name already exists
const nameAlreadyExists = async (name) => {
    return await Menu.findOne({ name }); 
}

module.exports = {
    createMenuItem,
    getMenuItems,
    getMenuItemById,
    getMenuItemBySlugId,
    updateMenuItem,
    deleteMenuItem,
    nameAlreadyExists
};
