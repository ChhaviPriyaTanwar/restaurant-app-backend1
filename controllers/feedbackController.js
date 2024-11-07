const feedbackService = require('../services/feedbackService');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');

// Add a new feedback
const addFeedback = async (req, res) => {
    try {
        const { userId, orderId, comment, rating } = req.body; // Extract parameters from request body
        const feedback = await feedbackService.createFeedback({ userId, orderId, comment, rating });
        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.FEEDBACK_CREATED, feedback);
    } catch (error) {
        console.error("Error creating feedback:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FEEDBACK_CREATION_FAILED, error.message);
    }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await feedbackService.getAllFeedback();
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FEEDBACKS_RETRIEVED, feedbacks);
    } catch (error) {
        console.error("Error retrieving feedbacks:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FEEDBACKS_RETRIEVAL_FAILED, error.message);
    }
};

// Get feedback by ID
const getFeedbackById = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const feedback = await feedbackService.getFeedbackById(feedbackId);
        if (!feedback) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.FEEDBACK_NOT_FOUND);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FEEDBACK_RETRIEVED, feedback);
    } catch (error) {
        console.error("Error retrieving feedback:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FEEDBACK_RETRIEVAL_FAILED, error.message);
    }
};

// Update feedback
const updateFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const updatedFeedback = await feedbackService.updateFeedback(feedbackId, req.body);
        if (!updatedFeedback) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.FEEDBACK_NOT_FOUND);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FEEDBACK_UPDATED, updatedFeedback);
    } catch (error) {
        console.error("Error updating feedback:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FEEDBACK_UPDATE_FAILED, error.message);
    }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const deletedFeedback = await feedbackService.deleteFeedback(feedbackId);
        if (!deletedFeedback) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.FEEDBACK_NOT_FOUND);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.FEEDBACK_DELETED, deletedFeedback);
    } catch (error) {
        console.error("Error deleting feedback:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.FEEDBACK_DELETION_FAILED, error.message);
    }
};

module.exports = {
    addFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
};
