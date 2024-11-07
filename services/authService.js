const User = require('../models/user');
const bcrypt = require('bcrypt');


// Singup
const signupUser = async ({ name, email, phone, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: role,
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: 0,
    });
    return user;
};

// Get Reset Token
const getResetToken = async (resetToken) => {
    return await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() } // Token is valid if it hasn’t expired
    });
}; 


module.exports = {
    signupUser,
    getResetToken
};  