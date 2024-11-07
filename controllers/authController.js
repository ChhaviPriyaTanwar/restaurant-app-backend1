const User = require('../models/user');
const responseHandler = require('../utils/responseHandler');
const { generateToken } = require('../middlewares/authMiddleware');
const authService = require('../services/authService');
const logger = require('../utils/logger');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userService = require('../services/userService');
const { v4: uuidv4 } = require('uuid');


// Signup - name,email,phone,password,confirmPassoword,role
// Login - email,password
// ForgetPassword - email
// RestPassword - restToken,newPssword,confrimPassword

// Signup Api -
const signup = async (req, res) => {
    const { name, email, phone, password, confirmPassword, role } = req.body;
    try {
        // Check blank
        if (!name || !email || !phone || !password || !confirmPassword) {
            console.log(` name: ${name} \n email: ${email} \n phone: ${phone} \n password: ${password} \n confirmPassword: ${confirmPassword}`.bgGreen);
            logger.warn(`Signup failed: Required field are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }

        // Check if user already exists with email
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            logger.warn(`Signup failed: Email already exists: ${email}`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.EMAIL_EXISTS, null);
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            logger.warn(`Signup failed for ${email}: Passwords do not match`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.PASSWORD_NOT_MATCH, null);
        }

        const validRoles = ['user', 'admin', 'staff'];

        const userRole = validRoles.includes(role) ? role : 'user';


        // Check role
        if (role && !validRoles.includes(role)) {
            logger.warn(`Signup failed for ${email}: Invalid role: ${role}`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.INVALID_ROLE, null);
        }

        // Check if the role is 'staff'
        // if (userRole === 'staff') {
        //     const staffExists = await Staff.findOne({ email });
        //     if (!staffExists) {
        //         logger.warn(`Signup failed for ${email}: Staff email not found in staff records`);
        //         return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.STAFF_EMAIL_NOT_FOUND);
        //     }
        // }

        const slugId = uuidv4(); 
        const hashedPassword = await bcrypt.hash(password, 10);


        // Set values
        const userData = {
            slugId,
            name,
            email, 
            phone, 
            password : hashedPassword, 
            role: userRole,
            isVerified: false,
            createdAt: Math.floor(Date.now() / 1000),
            updatedAt: 0
        };

        // const userData = await authService.signupUser({ name, email, phone, password, role: userRole });

        const user = await userService.saveUser(userData);

        logger.info(`User signed up: ${email}`);
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.USER_SIGNUP_SUCCESS, user);
    } catch (error) {
        logger.error(`Signup failed for ${req.body.email}: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.USER_SIGNUP_SUCCESS, null);
    }
};


// Login Api -
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check blank
        if (!email || !password) {
            console.log(` email: ${email} \n password: ${password}`.bgGreen);
            logger.warn(`Login failed: Required field are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }

        // Check if user exists
        const user = await userService.getUserByEmail(email);
        if (!user) {
            logger.warn(`Login failed: No user found with email: ${email}`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.USER_NOT_FOUND, null);
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Login failed for ${email}: Incorrect password`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.INCORRECT_PASSWORD, null);
        }

        // Generate tokens
        const token = generateToken(user);
        logger.info(`generate token : ${token}`);
        logger.info(`user login details : ${user}`);

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.LOGIN_SUCCESS, { user, token });
    } catch (error) {
        logger.error(`Login failed for ${email}: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.LOGIN_FAILED, null);
    }
};

// Forget Password Api -
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Check blank
        if (!email) {
            console.log(` email: ${email}`.bgGreen);
            logger.warn(`Forget Password failed: Required field are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }

        // Find user by email
        const user = await userService.getUserByEmail(email);
        if (!user) {
            logger.warn(`Forgot password failed: No user found with email: ${email}`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.USER_NOT_FOUND, null);
        }

        // Generate a reset token and expiration date
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;

        const userData = await userService.saveUser(user); //save


        logger.info(`Reset password token generated for: ${email}`);

        return responseHandler(res, STATUS_CODE.OK, MESSAGE.RESET_LINK_SENT, userData);
    } catch (error) {
        logger.error(`Forgot password failed for ${req.body.email}: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.RESET_FAILED, null);
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;
    try {
        // Check blank
        if (!resetToken || !newPassword || !confirmPassword) {
            console.log(` resetToken: ${resetToken} \n newPassword: ${newPassword} \n confirmPassword: ${confirmPassword}`.bgGreen);
            logger.warn(`RestPassword failed: Required field are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS, null);
        }

        // Compare newPassword and confirmPassword 
        if (newPassword !== confirmPassword) {
            logger.warn(`Reset password failed: Passwords do not match`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.PASSWORD_NOT_MATCH, null);
        }

        // Find user by reset token and check token expiration
        const user = await authService.getResetToken(resetToken);

        if (!user) {
            logger.warn(`Reset password failed: Invalid or expired token`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.INVALID_RESET_TOKEN, null);
        }

        // Hash and set the new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined; // Clear reset token
        user.resetPasswordExpires = undefined; // Clear token expiration

        const userData = await userService.saveUser(user); //save

        logger.info(`ResetPassword successfully for: ${user.email}`);
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.PASSWORD_RESET_SUCCESS, userData);
    } catch (error) {
        logger.error(`Reset password failed: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.RESET_FAILED, null);
    }
};

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword
};
