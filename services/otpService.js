const OTP = require('../models/otp');

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
};

const getOtp = async (userId, otpCode) => {
    return await OTP.findOne({ user_id: userId, otp_code: otpCode });
};

const createOtp = async (userId) => {
    const otpCode = generateOtp();
    const expiresAt = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now in epoch time

    const otp = await OTP.create({
        user_id: userId,
        otp_code: otpCode,
        expires_at: expiresAt,
    });

    return otp;
};

const verifyOtp = async (userId, otpCode) => {
    const otp = await OTP.findOne({ user_id: userId, otp_code: otpCode });

    if (!otp || otp.expires_at < Math.floor(Date.now() / 1000)) {
        return null;
    }

    otp.verified = true;
    await otp.save();

    return otp;
};

// save otp
const saveOtp = async (otp) => {
    return await otp.save(); 
};

module.exports = {
    createOtp,
    verifyOtp,
    getOtp,
    saveOtp
};
