// Add new staff memeber

const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['manager', 'waiter', 'chef', 'cleaner'], // Example roles
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    createTs: {
        type: Number,
        default: Date.now,
    },
    updateTs: {
        type: Number,
        default: 0,
    },
});

// Middleware to update the updateTs field
staffSchema.pre('save', function (next) {
    this.updateTs = Date.now();
    next();
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
