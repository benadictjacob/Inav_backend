// ============================================
// Payment Controller
// ============================================
// Handles HTTP requests for payment-related
// endpoints. Delegates logic to paymentService.
// ============================================

const catchAsync = require('../utils/catchAsync');
const paymentService = require('../services/paymentService');

/**
 * POST /api/payments
 * Creates a new payment.
 * Body: { account_number, amount }
 */
const createPayment = catchAsync(async (req, res) => {
    const { account_number, amount } = req.body;
    const payment = await paymentService.createPayment(account_number, amount);

    res.status(201).json({
        success: true,
        message: 'Payment recorded successfully',
        data: payment,
    });
});

/**
 * GET /api/payments/:accountNumber
 * Returns payment history for a customer.
 */
const getPaymentHistory = catchAsync(async (req, res) => {
    const { accountNumber } = req.params;
    const history = await paymentService.getPaymentHistory(accountNumber);

    res.status(200).json({
        success: true,
        data: history,
    });
});

module.exports = {
    createPayment,
    getPaymentHistory,
};
