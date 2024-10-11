/**
 * Send a standard response to the client
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {Object} data - Response data
 */
const sendResponse = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message,
        data,
    });
};

module.exports = { sendResponse };