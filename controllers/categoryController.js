const categoryService = require('../services/categoryService');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');


// Create Category - name,description
// Get All Category
// Get By Id Category
// Update Category
// Delete Category

// Create a new category
const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        // Validate input fields
        if (!name || !description) {
            logger.warn(`Category creation failed: Required fields are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }

        // Check if category with the same name already exists
        const existingCategoryName = await categoryService.nameAlreadyExists(name);
        if (existingCategoryName) {
            logger.warn(`Category creation failed: Category with name '${name}' already exists`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.CATEGORY_NAME_EXISTS, null);
        }

        const slugId = uuidv4();  // generate unique slugId
        const createdAt = Math.floor(Date.now() / 1000);
        const categoryData = { slugId, name, description, createdAt, updatedAt: 0 };
        const newCategory = await categoryService.createCategory(categoryData);

        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.CATEGORY_CREATED, newCategory);
    } catch (error) {
        logger.error(`Failed to create category: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CATEGORY_CREATION_FAILED, null);
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();

        if (categories.length === 0) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.NO_DATA_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CATEGORIES_RETRIEVED, categories);
    } catch (error) {
        logger.error(`Failed to retrieve categories: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CATEGORIES_FETCH_FAILED, null);
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the category exists
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.CATEGORY_NOT_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CATEGORY_RETRIEVED, category);
    } catch (error) {
        logger.error(`Failed to retrieve category: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CATEGORIES_FETCH_FAILED, null);
    }
};

// Get a single category by slug ID
const getCategoryBySlugId = async (req, res) => {
    const { slugId } = req.params;

    try {
        // Check if the category exists
        const category = await categoryService.getCategoryBySlugId(slugId);
        if (!category) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.CATEGORY_NOT_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CATEGORY_RETRIEVED, category);
    } catch (error) {
        logger.error(`Failed to retrieve category: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CATEGORIES_FETCH_FAILED, null);
    }
};

// Update a category by ID
const updateCategoryById = async (req, res) => {
    const { id, name, description, } = req.body;

    try {
        // Check for required ID
        if (!id) {
            logger.warn(`Required field 'id' is missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ID_REQUIRED,null);
        }

        // Check if category exists by ID
        const existingCategory = await categoryService.getCategoryById(id);
        if (!existingCategory) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.CATEGORY_NOT_FOUND, null);
        }

        // Prepare updated data
        const updatedAt = Math.floor(Date.now() / 1000);
        const updatedCategoryData = { name, description, updatedAt };

        // Update the category and retrieve the updated result
        const updatedCategory = await categoryService.updateCategoryById(id, updatedCategoryData);

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CATEGORY_UPDATED, updatedCategory);
    } catch (error) {
        logger.error(`Failed to update category: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CATEGORY_UPDATE_FAILED, null);
    }
};

// Delete a category by ID
const deleteCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate the presence of the ID
        if (!id) {
            logger.warn(`Required field 'id' is missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ID_REQUIRED);
        }

        // Check if the category exists
        const existingCategory = await categoryService.getCategoryById(id);
        if (!existingCategory) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.CATEGORY_NOT_FOUND, null);
        }

        // Proceed to delete the category
        await categoryService.deleteCategoryById(id);
        
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.CATEGORY_DELETED, null);
    } catch (error) {
        logger.error(`Failed to delete category: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.CATEGORY_DELETE_FAILED, null);
    }
};

// Export the category controller functions
module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoryBySlugId,
    updateCategoryById,
    deleteCategoryById,
};
