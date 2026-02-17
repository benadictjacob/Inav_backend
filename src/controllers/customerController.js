// ============================================
// Customer Controller
// ============================================
// Handles HTTP requests for customer-related
// endpoints. Delegates logic to customerService.
// ============================================

const catchAsync = require('../utils/catchAsync');
const customerService = require('../services/customerService');

/**
 * GET /api/customers
 * Returns all customers.
 */
const getAllCustomers = catchAsync(async (req, res) => {
    const customers = await customerService.getAllCustomers();

    res.status(200).json({
        success: true,
        count: customers.length,
        data: customers,
    });
});

/**
 * GET /api/customers/:accountNumber
 * Returns a single customer by account number.
 */
const getCustomerByAccount = catchAsync(async (req, res) => {
    const { accountNumber } = req.params;
    const customer = await customerService.getCustomerByAccountNumber(accountNumber);

    res.status(200).json({
        success: true,
        data: customer,
    });
});

module.exports = {
    getAllCustomers,
    getCustomerByAccount,
};
