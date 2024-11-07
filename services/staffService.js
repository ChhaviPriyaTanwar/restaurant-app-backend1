const Staff = require('../models/staff');
const { MESSAGE } = require('../utils/constants');

// Create a new staff member
const createStaff = async (staffData) => {
    try {
        const staff = new Staff(staffData);
        await staff.save();
        return staff;
    } catch (error) {
        throw new Error(`Failed to create staff: ${error.message}`);
    }
};

// Retrieve all staff members
const getAllStaff = async () => {
    return await Staff.find();
};

// Retrieve a specific staff member by ID
const getStaffById = async (staffId) => {
    return await Staff.findById(staffId);
};

// Update a staff member
const updateStaff = async (staffId, updateData) => {
    return await Staff.findByIdAndUpdate(staffId, updateData, { new: true });
};

// Delete a staff member
const deleteStaff = async (staffId) => {
    return await Staff.findByIdAndDelete(staffId);
};

module.exports = {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
};
