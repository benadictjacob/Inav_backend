// ============================================
// Route Aggregator
// ============================================
// Combines all route modules under /api prefix.
// ============================================

const express = require('express');
const customerRoutes = require('./customerRoutes');
const paymentRoutes = require('./paymentRoutes');

const router = express.Router();

router.use('/customers', customerRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
