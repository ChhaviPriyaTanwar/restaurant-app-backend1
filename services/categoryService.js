const Category = require('../models/category');

// Create a new category
const createCategory = async (categoryData) => {
    const category = await Category.create(categoryData);
    return category;
};

// Get all categories
const getAllCategories = async () => {
    return await Category.find();
};

// Get a single category by ID
const getCategoryById = async (id) => {
    return await Category.findById(id);
};

// Get a single category by slug ID
const getCategoryBySlugId = async (slugId) => {
    return await Category.findOne({ slugId });
};

// Update a category by ID
const updateCategoryById = async (id, updatedData) => {
    return await Category.findByIdAndUpdate(id, updatedData, { new: true });
};

// Delete a category by ID
const deleteCategoryById = async (id) => {
    return await Category.findByIdAndDelete(id);
};

// Name already exists
const nameAlreadyExists = async (name) => {
    return await Category.findOne({ name }); //This is equivalent to { name: name }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoryBySlugId,
    updateCategoryById,
    deleteCategoryById,
    nameAlreadyExists
};
