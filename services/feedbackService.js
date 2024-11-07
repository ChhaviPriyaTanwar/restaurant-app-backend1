const Feedback = require('../models/feedback');
const { MESSAGE } = require('../utils/constants');

// Create a new feedback
const createFeedback = async ({ userId, orderId, comment, rating }) => {
    try {
        const feedbackData = { userId, orderId, comment, rating };
        const feedback = new Feedback(feedbackData);
        await feedback.save();
        return feedback;
    } catch (error) {
        throw new Error(`Failed to create feedback: ${error.message}`);
    }
};

// Retrieve all feedback
const getAllFeedback = async () => {
    return await Feedback.find().populate('userId orderId'); // Populate user and order details
};

// Retrieve feedback by ID
const getFeedbackById = async (feedbackId) => {
    return await Feedback.findById(feedbackId).populate('userId orderId');
};

// Update feedback
const updateFeedback = async (feedbackId, updateData) => {
    return await Feedback.findByIdAndUpdate(feedbackId, updateData, { new: true }).populate('userId orderId');
};

// Delete feedback
const deleteFeedback = async (feedbackId) => {
    return await Feedback.findByIdAndDelete(feedbackId);
};

module.exports = {
    createFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
};
