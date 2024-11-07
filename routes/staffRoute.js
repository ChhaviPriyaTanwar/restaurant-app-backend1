const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Routes for staff management
router.post('/', staffController.addStaff); // Create a new staff member
router.get('/', staffController.getStaff); // Get all staff members
router.get('/:staffId', staffController.getStaffById); // Get a specific staff member
router.put('/:staffId', staffController.updateStaff); // Update a specific staff member
router.delete('/:staffId', staffController.deleteStaff); // Delete a specific staff member

module.exports = router;
