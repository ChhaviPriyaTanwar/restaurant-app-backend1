// controllers/otpController.js

const OTPService = require('../services/otpService');
const User = require('../models/user');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');
const logger = require('../utils/logger');
const userService = require('../services/userService');

// Otp - email
// Verify Otp - email,otp_code

// Otp Api -
const requestOtp = async (req, res) => {    
    const { email } = req.body;
    try {
        //Check black
        if(!email){
            console.log(` email: ${email}`.bgGreen);
            logger.warn(`OTP failed: Required field are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS,null);
        }

        //Check user already exist
        const user = await userService.getUserByEmail(email);
        if (!user) {
            logger.warn(`OTP request failed: No user found with email: ${email}`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.USER_NOT_FOUND, null);
        }

        //Create otp
        const otpData = await OTPService.createOtp(user._id);

        logger.info(`OTP generated for user: ${user._id}`);
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.OTP_SENT_SUCCESS, otpData);
    } catch (error) {
        logger.error(`OTP request failed for ${email}: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.OTP_REQUEST_FAILED,null);
    }
};

//Verify Otp Api -
const verifyOtp = async (req, res) => {
    const { email, otp_code } = req.body;
    try {

        if(!email ||!otp_code){
            console.log(` email: ${email} \n otp: ${otp_code}`.bgGreen);
            logger.warn(`OTP Verify failed: Required field are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS,null);
        }

        // Find user by email
        const user = await userService.getUserByEmail(email);
        if (!user) {
            logger.warn(`OTP verification failed: No user found with email: ${email}`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.USER_NOT_FOUND, null);
        }

        // Fetch OTP associated with the user and the provided OTP code
        const otp = await OTPService.getOtp(user._id, otp_code);
        
        // Check if OTP is found
        if (!otp) {
            logger.warn(`OTP verification failed for ${email}: Invalid OTP`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.INVALID_OTP, null);
        }

        // Check if OTP is expired
        const currentEpoch = Math.floor(Date.now() / 1000);
        if (otp.expires_at < currentEpoch) {
            logger.warn(`OTP verification failed for ${email}: OTP expired`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.EXPIRED_OTP, null);
        }

        // Set the value of otp 
        // Mark OTP as verified if valid and not expired
        otp.verified = true;
        otp.verified_at = currentEpoch;
        const otpData = await OTPService.saveOtp(otp);

        logger.info(`OTP verified for user: ${user._id}`);
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.OTP_VERIFIED_SUCCESS, otpData);
    } catch (error) {
        logger.error(`OTP verification failed for ${email}: ${error.message}`);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.OTP_VERIFICATION_FAILED, null);
    }
};

module.exports = {
    requestOtp,
    verifyOtp,
};
