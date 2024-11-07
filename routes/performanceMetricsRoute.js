// routes/performanceMetrics.js

const express = require('express');
const { createPerformanceMetrics, getPerformanceMetrics } = require('../controllers/performanceMetricsController');

const router = express.Router();

// Create performance metrics
router.post('/', createPerformanceMetrics);

// Get performance metrics
router.get('/', getPerformanceMetrics);

module.exports = router;
