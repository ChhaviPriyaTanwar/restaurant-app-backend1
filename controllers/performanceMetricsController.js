// controllers/performanceMetricsController.js

const PerformanceMetrics = require('../models/performanceMetrics');
const Order = require('../models/order');
const Bill = require('../models/bill');
const Feedback = require('../models/feedback');

const calculateMetrics = async () => {
    const metrics = {};

    metrics.totalOrders = await Order.countDocuments({});
    metrics.completedOrders = await Order.countDocuments({ status: 'Completed' });
    metrics.cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Top menu item by sales
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

    // Likes from feedback
    metrics.likes = await Feedback.aggregate([
        { $group: { _id: null, totalLikes: { $sum: "$likes" } } }
    ]);
    metrics.likes = metrics.likes.length > 0 ? metrics.likes[0].totalLikes : 0;

    return metrics;
};

const createPerformanceMetrics = async (req, res) => {
    try {
        const metrics = await calculateMetrics();

        const performanceMetrics = new PerformanceMetrics(metrics);
        await performanceMetrics.save();

        return res.status(201).json({
            statusCode: 201,
            message: "Performance metrics created successfully.",
            data: performanceMetrics,
        });
    } catch (error) {
        console.error("Error creating performance metrics:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Error creating performance metrics.",
            error: error.message,
        });
    }
};

const getPerformanceMetrics = async (req, res) => {
    try {
        const metrics = await PerformanceMetrics.find().sort({ createdAt: -1 }).limit(1); // Get the latest metrics
        return res.status(200).json({
            statusCode: 200,
            message: "Performance metrics retrieved successfully.",
            data: metrics,
        });
    } catch (error) {
        console.error("Error retrieving performance metrics:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Error retrieving performance metrics.",
            error: error.message,
        });
    }
};

module.exports = {
    createPerformanceMetrics,
    getPerformanceMetrics,
};
