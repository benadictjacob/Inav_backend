// ============================================
// Customer Routes
// ============================================

const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

/**
 * GET /api/customers
 * Retrieve all customers
 */
router.get('/', customerController.getAllCustomers);

/**
 * GET /api/customers/:accountNumber
 * Retrieve a single customer by account number
 */
router.get('/:accountNumber', customerController.getCustomerByAccount);

module.exports = router;
