// ============================================
// Centralized Error Handler Middleware
// ============================================
// Catches all errors passed via next(err) and
// returns a structured JSON response.
// ============================================

/**
 * Centralized error handler.
 * Distinguishes between operational errors (thrown intentionally)
 * and programming/unknown errors.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
    // Default to 500 if no status code is set
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';
    let status = err.status || 'error';

    // Handle Prisma known request errors (e.g., unique constraint)
    if (err.code === 'P2002') {
        statusCode = 409;
        status = 'fail';
        message = `Duplicate value for field: ${err.meta?.target?.join(', ')}`;
    }

    // Handle Prisma record not found
    if (err.code === 'P2025') {
        statusCode = 404;
        status = 'fail';
        message = 'Record not found';
    }

    // Build response payload
    const response = {
        success: false,
        status,
        message,
    };

    // Include stack trace in development mode
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('❌ Error:', err);
    }

    res.status(statusCode).json(response);
};

module.exports = { errorHandler };
