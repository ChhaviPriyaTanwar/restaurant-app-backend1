// models/otp.js

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    otp_code: {
        type: String,
        required: true,
    },
    expires_at: {
        type: Number, // Using Number for epoch time
        required: true,
    },
    created_at: {
        type: Number, // Using Number for epoch time
        default: Math.floor(Date.now() / 1000), // Set current time as epoch
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verified_at: {
        type: Number,
        default: 0
    }
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
