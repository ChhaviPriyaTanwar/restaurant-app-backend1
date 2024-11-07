const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    slugId: { 
        type: String, 
        unique: true 
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
    },
    resetPasswordToken: { 
        type: String 
    }, 
    resetPasswordExpires: { 
        type: Date 
    }, 
    createdAt: {
        type: Number,
    },
    updatedAt: {
        type: Number,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;