// ============================================
// Payment Routes
// ============================================

const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { validate } = require('../middlewares/validate');

const router = express.Router();

/**
 * POST /api/payments
 * Create a new payment
 * Body: { account_number: string, amount: number }
 */
router.post(
    '/',
    [
        body('account_number')
            .trim()
            .notEmpty()
            .withMessage('Account number is required'),
        body('amount')
            .isFloat({ gt: 0 })
            .withMessage('Amount must be a number greater than 0'),
    ],
    validate,
    paymentController.createPayment
);

/**
 * GET /api/payments/:accountNumber
 * Get payment history for a customer
 */
router.get('/:accountNumber', paymentController.getPaymentHistory);

module.exports = router;
