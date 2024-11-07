const responseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');
const userService = require('../services/userService');
const bcrypt = require('bcrypt');

// GetAllUsers
// GetUserById
// GetUserByEmail
// UpdateUserProfile
// DeleteUserProfile

// Get all users API
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        // Check if no records found
        if (users.length === 0) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.NO_DATA_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.USERS_FETCHED_SUCCESS, users);
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.USERS_FETCHED_FAILED, null);
    }
};

// Get user by ID API
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        // Check for required ID
        if (!id) {
            logger.warn(`Required field 'id' is missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ID_REQUIRED);
        }

        // Check if user exists
        const user = await userService.getUserById(id);
        if (!user) {
            logger.warn(`User not found with ID: ${id}`);
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.USER_NOT_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.USER_FETCHED_SUCCESS, user);
    } catch (error) {
        logger.error(`Error fetching user by ID: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.USER_FETCHED_FAILED, null);
    }
};

const getUserBySlugId = async (req, res) => {
    const { slugId } = req.params;
    try {
        // Check for required ID
        if (!slugId) {
            logger.warn(`Required field 'id' is missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ID_REQUIRED);
        }

        // Check if user exists
        const user = await userService.getUserBySlugId(slugId);
        if (!user) {
            logger.warn(`User not found with ID: ${id}`);
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.USER_NOT_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.USER_FETCHED_SUCCESS, user);
    } catch (error) {
        logger.error(`Error fetching user by ID: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.USER_FETCHED_FAILED, null);
    }
};

// Get user by email API
const getUserByEmail = async (req, res) => {
    const { email } = req.query;
    try {
        // Check for required email
        if (!email) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.EMAIL_REQUIRED, null);
        }

        // Check if user exists
        const user = await userService.getUserByEmail(email);
        if (!user) {
            logger.warn(`User not found with email: ${email}`);
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.USER_NOT_FOUND, null);
        }

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.USER_FETCHED_SUCCESS, user);
    } catch (error) {
        logger.error(`Error fetching user by email: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.USER_FETCHED_FAILED, null);
    }
};

// Update user profile API
const updateUserProfile = async (req, res) => {
    const { id, name, email, password } = req.body;

    try {
        // Check for required ID
        if (!id) {
            logger.warn(`Required field 'id' is missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ID_REQUIRED,null);
        }

        // Check if user exists
        const existUser = await userService.getUserById(id);
        if (!existUser) {
            logger.warn(`User not found with ID: ${id}`);
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.USER_NOT_FOUND, null);
        }

        // Set values
        const updatedUserData = { 
            name, 
            email,
            updatedAt: Math.floor(Date.now() / 1000)
         };

        if (password) {
            updatedUserData.password = await bcrypt.hash(password, 10);
        }        

        const updatedUser = await userService.updateUserProfile(id, updatedUserData);
        logger.info(`User profile updated: ${updatedUser.email}`);
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.USER_UPDATED_SUCCESS, updatedUser);
    } catch (error) {
        logger.error(`Error updating user profile: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.USER_UPDATED_FAILED, null);
    }
};

// Delete user profile API
const deleteUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        // Check for required ID
        if (!id) {
            logger.warn(`Required field 'id' is missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ID_REQUIRED);
        }

        // Check if user exists      
        const user = await userService.deleteUserProfile(id);
        logger.info(`User profile deleted: ${id}`);
        if (!user) {
            logger.warn(`Delete failed: User not found with ID: ${id}`);
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.USER_NOT_FOUND, null);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.USER_DELETED_SUCCESS, null);
    } catch (error) {
        logger.error(`Error deleting user profile: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.USER_DELETED_FAILED, null);
    }
};

// User role and permission checks
const userAccess = (req, res) => {
    res.json({ message: 'User access granted' });
};

const adminAccess = (req, res) => {
    res.json({ message: 'Admin access granted' });
};

const staffAccess = (req, res) => {
    res.json({ message: 'Staff access granted' });
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserBySlugId,
    getUserByEmail,
    updateUserProfile,
    deleteUserProfile,
    userAccess,
    adminAccess,
    staffAccess,
};
