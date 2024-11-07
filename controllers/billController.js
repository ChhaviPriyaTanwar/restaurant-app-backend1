// controllers/billController.js

const billService = require('../services/billService');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');

// Add a new bill
const addBill = async (req, res) => {
    try {
        const { orderId, userId, payment_mode, discount } = req.body;
        const bill = await billService.createBill({ orderId, userId, payment_mode, discount });
        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.BILL_CREATED, bill);
    } catch (error) {
        console.error("Error creating bill:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.BILL_CREATION_FAILED, error.message);
    }
};

// Get all bills
const getBills = async (req, res) => {
    try {
        const bills = await billService.getAllBills();
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.BILLS_RETRIEVED, bills);
    } catch (error) {
        console.error("Error retrieving bills:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.BILL_RETRIEVAL_FAILED, error.message);
    }
};

// Get a bill by ID
const getBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const bill = await billService.getBillById(billId);
        if (!bill) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.BILL_NOT_FOUND);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.BILL_RETRIEVED, bill);
    } catch (error) {
        console.error("Error retrieving bill:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.BILL_RETRIEVAL_FAILED, error.message);
    }
};

// Update a bill
const updateBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const updatedBill = await billService.updateBill(billId, req.body);
        if (!updatedBill) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.BILL_NOT_FOUND);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.BILL_UPDATED, updatedBill);
    } catch (error) {
        console.error("Error updating bill:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.BILL_UPDATE_FAILED, error.message);
    }
};

// Delete a bill
const deleteBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const deletedBill = await billService.deleteBill(billId);
        if (!deletedBill) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.BILL_NOT_FOUND);
        }
        return responseHandler(res, STATUS_CODE.OK, MESSAGE.BILL_DELETED, null);
    } catch (error) {
        console.error("Error deleting bill:", error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.BILL_DELETION_FAILED, error.message);
    }
};

module.exports = {
    addBill,
    getBills,
    getBill,
    updateBill,
    deleteBill,
};
