// ============================================
// Payment Service — Business Logic
// ============================================
// Encapsulates payment creation and history
// retrieval, validating business rules before
// persisting to the database.
// ============================================

const { PrismaClient } = require('@prisma/client');
const ApiError = require('../utils/ApiError');

const prisma = new PrismaClient();

/**
 * Generates a professional transaction ID.
 * Format: TXN-YYYYMMDD-XXXX where XXXX is a random hex string.
 */
const generateTransactionId = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(16).slice(2, 6).toUpperCase();
    return `TXN-${date}-${random}`;
};

/**
 * Create a new payment for a customer.
 *
 * Business rules:
 *  1. Account must exist
 *  2. Amount must be greater than 0
 *  3. Amount must not exceed EMI due balance
 *
 * @param {string} accountNumber - Customer's account number
 * @param {number} amount        - Payment amount (must be > 0)
 * @returns {Promise<Object>}    - Created payment record
 */
const createPayment = async (accountNumber, amount) => {
    const paymentAmount = parseFloat(amount);

    // 1. Validate the customer exists
    const customer = await prisma.customer.findUnique({
        where: { accountNumber },
    });

    if (!customer) {
        throw ApiError.notFound(`Customer with account number "${accountNumber}" not found`);
    }

    // 2. Validate amount
    if (!paymentAmount || paymentAmount <= 0) {
        throw ApiError.badRequest('Payment amount must be greater than 0');
    }

    // Updated Validation: Prevent paying more than the TOTAL balance
    if (paymentAmount > customer.totalBalance) {
        throw ApiError.badRequest(
            `Payment amount (₹${paymentAmount}) exceeds the total remaining balance (₹${customer.totalBalance}).`
        );
    }

    // 3. Create payment and update customer balances with rolling logic
    const rollingUpdate = await prisma.$transaction(async (tx) => {
        // Calculate the new total balance
        const newTotalBalance = customer.totalBalance - paymentAmount;

        // Calculate the next period's due amount
        // Logic: 
        // 1. If user paid more than emiDue, the excess reduces next month's installment.
        // 2. If user paid less than emiDue, the deficit + interest rolls into next month.
        const deficit = customer.emiDue - paymentAmount;
        const monthlyInterestRate = (customer.interestRate / 100) / 12;

        let nextEmiDue = customer.monthlyInstallment;

        if (deficit > 0) {
            // Underpaid: Add deficit + interest to next month
            const interestOnDeficit = deficit * monthlyInterestRate;
            nextEmiDue += (deficit + interestOnDeficit);
        } else if (deficit < 0) {
            // Overpaid: Subtract excess from next month
            nextEmiDue += deficit; // deficit is negative here
        }

        // Advance the due date by 1 month
        const nextDate = new Date(customer.nextDueDate);
        nextDate.setMonth(nextDate.getMonth() + 1);

        const paymentRecord = await tx.payment.create({
            data: {
                customerId: customer.id,
                transactionId: generateTransactionId(),
                amount: paymentAmount,
                status: 'success',
            },
        });

        const updatedCust = await tx.customer.update({
            where: { id: customer.id },
            data: {
                totalBalance: newTotalBalance,
                emiDue: Math.max(0, nextEmiDue), // Next month's target
                nextDueDate: nextDate,
                lastInterestCalc: new Date(),
            },
        });

        return { paymentRecord, updatedCust };
    });

    const { paymentRecord: payment, updatedCust: updatedCustomer } = rollingUpdate;

    // Attach updated customer info to payment object for response
    payment.customer = updatedCustomer;

    return payment;
};

/**
 * Retrieve payment history for a given account number.
 *
 * @param {string} accountNumber - Customer's account number
 * @returns {Promise<Object>}    - Customer info with payments array
 * @throws {ApiError} 404 if account not found
 */
const getPaymentHistory = async (accountNumber) => {
    const customer = await prisma.customer.findUnique({
        where: { accountNumber },
        include: {
            payments: {
                orderBy: { paymentDate: 'desc' },
            },
        },
    });

    if (!customer) {
        throw ApiError.notFound(`Customer with account number "${accountNumber}" not found`);
    }

    return {
        accountNumber: customer.accountNumber,
        customerName: customer.id,
        totalPayments: customer.payments.length,
        payments: customer.payments,
    };
};

module.exports = {
    createPayment,
    getPaymentHistory,
};
