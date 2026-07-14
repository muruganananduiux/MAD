const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message, errors: err.errors });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
};

module.exports = { errorHandler, notFound };
