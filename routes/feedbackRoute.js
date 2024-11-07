const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Add feedback
router.post('/', feedbackController.addFeedback);

// Get all feedback
router.get('/', feedbackController.getAllFeedback);

// Get feedback by ID
router.get('/:feedbackId', feedbackController.getFeedbackById);

// Update feedback
router.put('/:feedbackId', feedbackController.updateFeedback);

// Delete feedback
router.delete('/:feedbackId', feedbackController.deleteFeedback);

module.exports = router;
