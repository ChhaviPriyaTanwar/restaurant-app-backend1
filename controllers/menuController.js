const Menu = require('../models/menu');
const menuService = require('../services/menuService');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');
const categoryService = require('../services/categoryService');
const logger = require('../utils/logger');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


// Create menu item API
const createMenuItem = async (req, res) => {
    const { name, description, price, categoryId } = req.body;

    try {
        // Validate input fields
        if (!name || !description || !price || !categoryId) {
            logger.warn(`Menu creation failed: Required fields are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }

        // Check if category exists
        const category = await categoryService.getCategoryBySlugId(categoryId);
        if (!category) {
            logger.warn(`Menu creation failed: Category not found, category_id: ${categoryId}`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.CATEGORY_NOT_FOUND, null);
        }

        // Check if category with the same name already exists
        const existingMenuItemName = await menuService.nameAlreadyExists(name);
        if (existingMenuItemName) {
            logger.warn(`Menu creation failed: Menu with name '${name}' already exists`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.MENU_NAME_EXISTS, null);
        }

        const slugId = uuidv4();  // generate unique slugId

        const menuItemData = {
            slugId,
            name,
            description,
            price,
            categoryId: category.slugId,
            createdAt: Math.floor(Date.now() / 1000),
            updatedAt: 0
        };

        // Create menu item
        const menuItem = await menuService.createMenuItem(menuItemData);
        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.MENU_ITEM_CREATED, menuItem);
    } catch (error) {
        logger.error(`Menu item creation failed: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEM_CREATION_FAILED, null);
    }
};

// Get all menu API
const getMenuItems = async (req, res) => {
    try {
        const menuItems = await menuService.getMenuItems();

        if (menuItems.length === 0) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.NO_DATA_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_ITEMS_FETCHED, menuItems);
    } catch (error) {
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEMS_FETCH_FAILED, null);
    }
};

// Get all menu API
const getAllMenuCategoryItems = async (req, res) => {
    try {
        // Step 1: Fetch all menu items
        const menuItems = await menuService.getMenuItems();

        if (menuItems.length === 0) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.NO_DATA_FOUND, null);
        }

        // Step 2: Fetch the category for each menu item using categoryId (slugId)
        const menuItemsWithCategory = await Promise.all(menuItems.map(async (menuItem) => {
            // Fetch category using categoryId (which is slugId in this case)
            const category = await categoryService.getCategoryBySlugId(menuItem.categoryId);
            return {
                ...menuItem.toObject(),  // Convert to plain object
                category: category ? {
                    _id: category._id,
                    slugId: category.slugId,
                    name: category.name,
                    description: category.description,
                } : null  // If no category is found, set to null
            };
        }));

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_ITEMS_FETCHED, menuItemsWithCategory);
    } catch (error) {
        logger.error(`Failed to retrieve menu items and categories: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEMS_FETCH_FAILED, null);
    }
};

// simple get all menu with category
const getSimpleAllMenuCategoryItems = async (req, res) => {
        try {
            // Step 1: Fetch all menu items
            const menuItems = await menuService.getMenuItems();  // Get all menu items
    
            if (menuItems.length === 0) {
                return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.NO_DATA_FOUND, null);
            }
    
            // Step 2: Loop through each menu item to fetch its category using categoryId
            for (let i = 0; i < menuItems.length; i++) {
                const menuItem = menuItems[i];
    
                // Step 3: Fetch the category using the categoryId (which is the slugId here)
                const category = await categoryService.getCategoryBySlugId(menuItem.categoryId);
    
                if (category) {
                    // Create a new object combining the menuItem and its category data
                    menuItems[i] = {
                        ...menuItem.toObject(), // Convert menuItem to plain object (removes Mongoose methods)
                        category: {
                            _id: category._id,
                            slugId: category.slugId,
                            name: category.name,
                            description: category.description
                        }
                    };
                } else {
                    // If no category is found, add a null category to the menu item
                    menuItems[i] = {
                        ...menuItem.toObject(),
                        category: null
                    };
                }
            }
    
            // Step 4: Return the combined menu items with their respective categories
            return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_ITEMS_FETCHED, menuItems);
        } catch (error) {
            logger.error(`Failed to retrieve menu items and categories: ${error.message}`);
            return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEMS_FETCH_FAILED, null);
        }
    };       
    
// Get menu by ID API
const getMenuItemById = async (req, res) => {
    const { id } = req.params;

    try {
        const menuItem = await menuService.getMenuItemById(id);
        if (!menuItem) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.MENU_ITEM_NOT_FOUND, null);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_ITEM_FETCHED, menuItem);
    } catch (error) {
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEM_FETCH_FAILED, null);
    }
};

const getMenuItemBySlugId = async (req, res) => {
    const { slugId } = req.params;

    try {
        const menuItem = await menuService.getMenuItemBySlugId(slugId);
        if (!menuItem) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.MENU_ITEM_NOT_FOUND, null);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_ITEM_FETCHED, menuItem);
    } catch (error) {
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEM_FETCH_FAILED, null);
    }
};



// Get menu item and its category by menu item ID
const getMenuCategoryItemById = async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Find the menu item by its own _id
        const menuItem = await menuService.getMenuItemById(id);
        if (!menuItem) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.MENU_ITEM_NOT_FOUND, null);
        }
        console.log(`menuItem : ${menuItem}`);
        // Step 2: Find the category using the slugId stored in menuItem.categoryId
        const category = await categoryService.getCategoryBySlugId(menuItem.categoryId);
        if (!category) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.CATEGORY_NOT_FOUND, null);
        }

        // Step 3: Combine menu item and category data
        const responseData = {
            ...menuItem.toObject(),
            category: {
                _id: category._id,
                slugId: category.slugId,
                name: category.name,
                description: category.description,
            }
        };

        // Return the combined data
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_ITEM_FETCHED, responseData);
    } catch (error) {
        logger.error(`Failed to retrieve menu item and category: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEM_FETCH_FAILED, null);
    }
};


// Update menu API
const updateMenuItem = async (req, res) => {
    const { id, name, description, price, category_id } = req.body;

    try {

        // Check for required ID
        if (!id) {
            logger.warn(`Required field 'id' is missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ID_REQUIRED, null);
        }

        // Check if menu exists by ID
        const existingMenu = await menuService.getMenuItemById(id);
        if (!existingMenu) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.MENU_ITEM_NOT_FOUND, null);
        }

        // Define update data object
        const updatedMenuItemData = {
            name,
            description,
            price,
            updatedAt: Math.floor(Date.now() / 1000)
        };

        // Check if category_id is provided, then validate category
        // if (category_id) {
        //     const category = await categoryService.getCategoryById(category_id);
        //     if (!category) {
        //         return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.CATEGORY_NOT_FOUND, null);
        //     }

        //     // Add category details to update data
        //     updatedMenuItemData.category_id = category._id;
        //     updatedMenuItemData.category_name = category.name;
        // }

        // Update menu item in the database
        const updatedMenuItem = await menuService.updateMenuItem(id, updatedMenuItemData);
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_ITEM_UPDATED, updatedMenuItem);

    } catch (error) {
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEM_UPDATE_FAILED, null);
    }
};

// Delete menu API
const deleteMenuItem = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate the presence of the ID
        if (!id) {
            logger.warn(`Required field 'id' is missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ID_REQUIRED,null);
        }

        // Check if menu exists
        const menu = await menuService.getMenuItemById(id);
        if (!menu) {
            logger.warn(`Delete failed: Menu not found with ID: ${id}`);
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.MENU_ITEM_NOT_FOUND, null);
        }

        await menuService.deleteMenuItem(id);        
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_ITEM_DELETED,null);
    } catch (error) {
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEM_DELETE_FAILED, null);
    }
};

// Get menu pagination (search,page,limit) API
const getPaginatedMenu = async (req, res) => {
    try {
        // Extract `search`, `page`, and `limit` from query parameters
        const search = req.query.search || ''; // Search keyword
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = parseInt(req.query.limit); // Items per page (can be undefined)

        // Create a regex pattern for case-insensitive search
        const searchRegex = new RegExp(search, 'i'); // 'i' makes it case-insensitive

        // Fetch total documents matching the search
        const totalDocuments = await Menu.countDocuments({ name: searchRegex }); // Assuming menu items have a `name` field

        // Calculate the number of documents to skip for pagination
        const skip = (page - 1) * limit;

        // Fetch filtered menu items with optional pagination
        let menuItems;
        if (limit) {
            // If limit is specified, apply pagination
            menuItems = await Menu.find({ name: searchRegex })
                .skip(skip) // Skip based on page number
                .limit(limit) // Limit results
                .sort({ createdAt: 1 }); // Sort by creation date ascending
        } else {
            // If limit is not specified, fetch all matching records
            menuItems = await Menu.find({ name: searchRegex })
                .sort({ createdAt: 1 }); // Sort by creation date ascending
        }

        // Calculate pagination details
        const totalPages = limit ? Math.ceil(totalDocuments / limit) : 1; // If no limit, total pages is 1
        const remainingPages = limit ? Math.max(0, totalPages - page) : 0; // Remaining pages calculation

        // Send response with items and pagination info
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_RETRIEVED, {
            items: menuItems,
            pagination: {
                totalDocuments,
                totalPages,
                currentPage: page,
                pageSize: limit || totalDocuments, // Show total documents as page size if no limit is set
                remainingPages
            }
        });
    } catch (error) {
        console.error("Error fetching menu items:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_FETCH_FAILED);
    }
};

// Get menu pagination (search,page,limit,sort-asc/desc) API
const getPaginatedMenuOrder = async (req, res) => {
    try {
        // Extract `search`, `page`, `limit`, and `sort` from query parameters
        const search = req.query.search || ''; // Search keyword
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = parseInt(req.query.limit); // Items per page (can be undefined)
        const sort = req.query.sort || 'asc'; // Sorting order (default to ascending)

        // Create a regex pattern for case-insensitive search
        const searchRegex = new RegExp(search, 'i'); // 'i' makes it case-insensitive

        // Fetch total documents matching the search
        const totalDocuments = await Menu.countDocuments({ name: searchRegex }); // Assuming menu items have a `name` field

        // Calculate the number of documents to skip for pagination
        const skip = (page - 1) * limit;

        // Determine sort order
        const sortOrder = sort.toLowerCase() === 'desc' ? -1 : 1; // Use -1 for descending, 1 for ascending
        const sortOptions = { name: sortOrder }; // Assuming sorting by the `name` field

        // Fetch filtered menu items with optional pagination and sorting
        let menuItems;
        if (limit) {
            // If limit is specified, apply pagination
            menuItems = await Menu.find({ name: searchRegex })
                .skip(skip) // Skip based on page number
                .limit(limit) // Limit results
                .sort(sortOptions); // Sort by specified field and order
        } else {
            // If limit is not specified, fetch all matching records
            menuItems = await Menu.find({ name: searchRegex })
                .sort(sortOptions); // Sort by specified field and order
        }

        // Calculate pagination details
        const totalPages = limit ? Math.ceil(totalDocuments / limit) : 1; // If no limit, total pages is 1
        const remainingPages = limit ? Math.max(0, totalPages - page) : 0; // Remaining pages calculation

        // Send response with items and pagination info
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.MENU_RETRIEVED, {
            items: menuItems,
            pagination: {
                totalDocuments,
                totalPages,
                currentPage: page,
                pageSize: limit || totalDocuments, // Show total documents as page size if no limit is set
                remainingPages
            }
        });
    } catch (error) {
        console.error("Error fetching menu items:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_FETCH_FAILED);
    }
};

//Upload Image
const uploadImage = async (req, res) => {
    try {
        const { menuId } = req.body; // Menu ID from the form data

        // Validate menu ID
        const menuItem = await Menu.findById(menuId);
        if (!menuItem) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.MENU_ITEM_NOT_FOUND);
        }

        // If image is uploaded successfully, it will be available in `req.file`
        if (req.file) {
            // Update the menu item with the image path
            menuItem.image = path.join('uploads', req.file.filename); // Save relative path or you can use absolute path
            await menuItem.save();

            return responseHandler(res, STATUS_CODE.OK, MESSAGE.IMAGE_UPLOADED, {
                menuItem,
            });
        } else {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, "Image upload failed. No file provided.");
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, "Image upload failed.", error.message);
    }
};

module.exports = {
    createMenuItem,
    getMenuItems,
    getAllMenuCategoryItems,
    getSimpleAllMenuCategoryItems,
    getMenuItemById,
    getMenuItemBySlugId,
    getMenuCategoryItemById,
    updateMenuItem,
    deleteMenuItem,
    getPaginatedMenu,
    getPaginatedMenuOrder,
    uploadImage
};













































// const createMenuItem = async (req, res) => {
//     try {
//          // Check if category exists
//          const category = await categoryService.getCategoryById(req.body.category);
//          console.log(`category : ${category}`);
//          if (!category) {
//              return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.CATEGORY_NOT_FOUND,null);
//          }

//          const menuItemData = {
//             ...req.body,
//             category_id: category._id,
//             category_name: category.name
//         };


//         const menuItem = await menuService.createMenuItem(menuItemData);

//         return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.MENU_ITEM_CREATED, menuItem);
//     } catch (error) {
//         return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.MENU_ITEM_CREATION_FAILED, error.message);
//     }
// };