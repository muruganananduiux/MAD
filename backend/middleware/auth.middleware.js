const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt.utils');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new ApiError(401, 'No token provided');
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    throw new ApiError(401, 'Invalid token');
  }
};

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) throw new ApiError(403, 'Forbidden');
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
