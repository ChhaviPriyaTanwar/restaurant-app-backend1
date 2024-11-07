// models/performanceMetrics.js

const mongoose = require('mongoose');

const performanceMetricsSchema = new mongoose.Schema({
    totalOrders: {
        type: Number,
        default: 0,
    },
    completedOrders: {
        type: Number,
        default: 0,
    },
    cancelledOrders: {
        type: Number,
        default: 0,
    },
    topMenuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu', // This can reference the Menu model
    },
    topSales: {
        type: Array,
        default: 0,
    },
    totalRevenue: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const PerformanceMetrics = mongoose.model('PerformanceMetrics', performanceMetricsSchema);

module.exports = PerformanceMetrics;
