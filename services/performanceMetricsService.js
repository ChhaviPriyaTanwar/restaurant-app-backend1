// services/performanceMetricsService.js

const PerformanceMetrics = require('../models/performanceMetrics');
const Order = require('../models/order');
const Bill = require('../models/bill');
const Feedback = require('../models/feedback');

const calculateMetrics = async () => {
    // Same calculation logic as in the controller
    const metrics = {};

    metrics.totalOrders = await Order.countDocuments({});
    metrics.completedOrders = await Order.countDocuments({ status: 'Completed' });
    metrics.cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    const topMenuItem = await Bill.aggregate([
        { $group: { _id: "$orderId", total: { $sum: "$totalPrice" } } },
        { $sort: { total: -1 } },
        { $limit: 1 },
    ]);
    metrics.topMenuItem = topMenuItem.length > 0 ? topMenuItem[0]._id : null;

    metrics.topSales = await Bill.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    metrics.totalRevenue = metrics.topSales.length > 0 ? metrics.topSales[0].total : 0;

    metrics.likes = await Feedback.aggregate([
        { $group: { _id: null, totalLikes: { $sum: "$likes" } } }
    ]);
    metrics.likes = metrics.likes.length > 0 ? metrics.likes[0].totalLikes : 0;

    return metrics;
};

const createPerformanceMetrics = async () => {
    const metrics = await calculateMetrics();
    const performanceMetrics = new PerformanceMetrics(metrics);
    await performanceMetrics.save();
    return performanceMetrics;
};

const getPerformanceMetrics = async () => {
    return await PerformanceMetrics.find().sort({ createdAt: -1 }).limit(1);
};

module.exports = {
    createPerformanceMetrics,
    getPerformanceMetrics,
};
