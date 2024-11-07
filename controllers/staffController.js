const staffService = require('../services/staffService');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');

// Add a new staff member
const addStaff = async (req, res) => {
    try {
        const staffData = req.body;
        const staff = await staffService.createStaff(staffData);
        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.STAFF_CREATED, staff);
    } catch (error) {
        console.error("Error creating staff:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.STAFF_CREATION_FAILED, error.message);
    }
};

// Get all staff members
const getStaff = async (req, res) => {
    try {
        const staff = await staffService.getAllStaff();
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.STAFF_RETRIEVED, staff);
    } catch (error) {
        console.error("Error retrieving staff:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.STAFF_RETRIEVAL_FAILED, error.message);
    }
};

// Get a staff member by ID
const getStaffById = async (req, res) => {
    try {
        const { staffId } = req.params;
        const staff = await staffService.getStaffById(staffId);
        if (!staff) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.STAFF_NOT_FOUND);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.STAFF_RETRIEVED, staff);
    } catch (error) {
        console.error("Error retrieving staff:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.STAFF_RETRIEVAL_FAILED, error.message);
    }
};

// Update a staff member
const updateStaff = async (req, res) => {
    try {
        const { staffId } = req.params;
        const updatedStaff = await staffService.updateStaff(staffId, req.body);
        if (!updatedStaff) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.STAFF_NOT_FOUND);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.STAFF_UPDATED, updatedStaff);
    } catch (error) {
        console.error("Error updating staff:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.STAFF_UPDATE_FAILED, error.message);
    }
};

// Delete a staff member
const deleteStaff = async (req, res) => {
    try {
        const { staffId } = req.params;
        const deletedStaff = await staffService.deleteStaff(staffId);
        if (!deletedStaff) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.STAFF_NOT_FOUND);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.STAFF_DELETED, deletedStaff);
    } catch (error) {
        console.error("Error deleting staff:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.STAFF_DELETION_FAILED, error.message);
    }
};

module.exports = {
    addStaff,
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
};
