// ============================================
// Validation Middleware
// ============================================
// Uses express-validator to validate incoming
// request data and return structured errors.
// ============================================

const { validationResult } = require('express-validator');

/**
 * Middleware that checks for validation errors from
 * preceding express-validator checks and returns
 * a 400 response with the error details.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
        }));

        return res.status(400).json({
            success: false,
            status: 'fail',
            message: 'Validation failed',
            errors: extractedErrors,
        });
    }

    next();
};

module.exports = { validate };
