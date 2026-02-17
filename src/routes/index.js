// ============================================
// Route Aggregator
// ============================================
// Combines all route modules under /api prefix.
// ============================================

const express = require('express');
const customerRoutes = require('./customerRoutes');
const paymentRoutes = require('./paymentRoutes');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.get('/debug/seed', async (req, res) => {
    try {
        const customers = [
            { accountNumber: 'ACC-10001', issueDate: new Date('2024-12-15'), interestRate: 8.5, tenure: 12, monthlyInstallment: 10000.00, emiDue: 10000.00, totalBalance: 120000.00, nextDueDate: new Date('2025-01-15') },
            { accountNumber: 'ACC-10002', issueDate: new Date('2024-12-20'), interestRate: 9.0, tenure: 12, monthlyInstallment: 15000.00, emiDue: 15000.00, totalBalance: 180000.00, nextDueDate: new Date('2025-01-20') },
            { accountNumber: 'ACC-10003', issueDate: new Date('2024-12-10'), interestRate: 7.5, tenure: 12, monthlyInstallment: 5000.00, emiDue: 5000.00, totalBalance: 60000.00, nextDueDate: new Date('2025-01-10') }
        ];
        await prisma.payment.deleteMany();
        await prisma.customer.deleteMany();
        await prisma.customer.createMany({ data: customers });
        res.json({ success: true, message: 'Database seeded successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.use('/customers', customerRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
