// ============================================
// Custom API Error Class
// ============================================
// Extends the native Error class to include
// an HTTP status code for structured responses.
// ============================================

class ApiError extends Error {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {string} message    - Human-readable error message
     * @param {boolean} isOperational - Whether the error is operational (expected)
     */
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // Capture stack trace, excluding the constructor call
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Factory: 400 Bad Request
     */
    static badRequest(message = 'Bad request') {
        return new ApiError(400, message);
    }

    /**
     * Factory: 404 Not Found
     */
    static notFound(message = 'Resource not found') {
        return new ApiError(404, message);
    }

    /**
     * Factory: 500 Internal Server Error
     */
    static internal(message = 'Internal server error') {
        return new ApiError(500, message, false);
    }
}

module.exports = ApiError;
