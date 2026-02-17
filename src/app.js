// ============================================
// Express Application Setup
// ============================================
// Configures middleware, routes, and the
// centralized error handler.
// ============================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// --------------- Security & Parsing ---------------

// Set security-related HTTP headers
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Parse incoming JSON payloads
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (disabled in test)
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// --------------- Health Check ---------------

app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});

// --------------- API Routes ---------------

app.use('/api', routes);

// --------------- 404 Handler ---------------

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// --------------- Error Handler ---------------

app.use(errorHandler);

module.exports = app;
