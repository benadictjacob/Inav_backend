// ============================================
// catchAsync — Async Error Wrapper
// ============================================
// Wraps async controller functions to forward
// any rejected promise to the error handler
// middleware, eliminating repetitive try/catch.
// ============================================

/**
 * @param {Function} fn - Async Express route handler
 * @returns {Function}  - Wrapped handler with error forwarding
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = catchAsync;
