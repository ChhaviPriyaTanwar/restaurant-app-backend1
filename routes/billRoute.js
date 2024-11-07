// routes/billRoutes.js

const express = require('express');
const { 
    addBill,
    getBills,
    getBill,
    updateBill,
    deleteBill 
} = require('../controllers/billController');

const router = express.Router();

// Define routes for bills
router.post('/', addBill); // Create a new bill
router.get('/', getBills); // Get all bills
router.get('/:billId', getBill); // Get a specific bill by ID
router.put('/:billId', updateBill); // Update a specific bill by ID
router.delete('/:billId', deleteBill); // Delete a specific bill by ID

module.exports = router;
