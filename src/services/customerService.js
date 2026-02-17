// ============================================
// Customer Service — Business Logic
// ============================================
// Encapsulates all database queries related to
// customers, keeping controllers thin.
// ============================================

const { PrismaClient } = require('@prisma/client');
const ApiError = require('../utils/ApiError');

const prisma = new PrismaClient();

/**
 * Retrieve all customers from the database.
 * @returns {Promise<Array>} List of all customers
 */
const getAllCustomers = async () => {
    const customers = await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return customers;
};

/**
 * Find a single customer by their unique account number.
 * @param {string} accountNumber - The account number to look up
 * @returns {Promise<Object>} Customer record
 * @throws {ApiError} 404 if account is not found
 */
const getCustomerByAccountNumber = async (accountNumber) => {
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

    return customer;
};

module.exports = {
    getAllCustomers,
    getCustomerByAccountNumber,
};
