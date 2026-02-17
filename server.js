// ============================================
// Server Entry Point
// ============================================
// Loads environment variables and starts the
// Express server on the configured port.
// ============================================

require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Graceful shutdown on unhandled rejection
process.on('unhandledRejection', (err) => {
    // eslint-disable-next-line no-console
    console.error('💥 Unhandled Rejection — shutting down...', err);
    server.close(() => {
        process.exit(1);
    });
});

// Graceful shutdown on uncaught exception
process.on('uncaughtException', (err) => {
    // eslint-disable-next-line no-console
    console.error('💥 Uncaught Exception — shutting down...', err);
    server.close(() => {
        process.exit(1);
    });
});
