const { v4: uuidv4 } = require('uuid');

const generateReceiptNo = () => {
  return `RCP-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
};

const sendSuccessResponse = (res, statusCode, message, data = {}) => {
  res.status(statusCode).json({ success: true, message, data });
};

const sendErrorResponse = (res, statusCode, message, errors = []) => {
  res.status(statusCode).json({ success: false, message, errors });
};

module.exports = { generateReceiptNo, sendSuccessResponse, sendErrorResponse };
