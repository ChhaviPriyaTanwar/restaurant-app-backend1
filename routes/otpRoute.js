// routes/otpRoute.js

const express = require('express');
const { requestOtp, verifyOtp } = require('../controllers/otpController');

const router = express.Router();

// Route to request OTP
router.post('/request-otp', requestOtp);

// Route to verify OTP
router.post('/verify-otp', verifyOtp);

module.exports = router;
