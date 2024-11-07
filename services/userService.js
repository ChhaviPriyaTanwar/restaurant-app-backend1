const User = require('../models/user');

// save user
const saveUser = async (userData) => {
    const user = await User.create(userData);
    return user; 
};

//get all users
const getAllUsers = async () => {
    return await User.find();
};

//get by id
const getUserById = async (id) => {
    return await User.findById(id);
};

//get by id
const getUserBySlugId = async (slugId) => {
    return await User.findOne({ slugId });
};

//get by email
const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

//update user
const updateUserProfile = async (id, updatedData) => {
    return await User.findByIdAndUpdate(id, updatedData, { new: true });
};

//delete user by id
const deleteUserProfile = async (id) => {
    return await User.findByIdAndDelete(id);
};

module.exports = {
    saveUser,
    getAllUsers,
    getUserById,
    getUserBySlugId,
    getUserByEmail,
    updateUserProfile,
    deleteUserProfile,
};
