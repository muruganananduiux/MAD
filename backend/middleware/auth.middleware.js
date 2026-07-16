const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/jwt.utils');

/**
 * Require a valid access token. Populates:
 *   req.userId   (string)
 *   req.userRole ('user' | 'ngo' | 'admin')
 *   req.user     ({ userId, role })
 */
const authMiddleware = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new ApiError(401, 'Authentication required'));
  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = { userId: decoded.userId, role: decoded.role };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return next(new ApiError(401, 'Token expired'));
    return next(new ApiError(401, 'Invalid token'));
  }
};

/**
 * Restrict to one or more roles. Must be used AFTER authMiddleware.
 *   router.get('/admin/x', authMiddleware, roleMiddleware('admin'), handler);
 */
const roleMiddleware = (...allowedRoles) => (req, _res, next) => {
  if (!req.userRole) return next(new ApiError(401, 'Authentication required'));
  if (!allowedRoles.includes(req.userRole)) return next(new ApiError(403, 'Forbidden: insufficient permissions'));
  return next();
};

/**
 * Optional auth: if a token is present + valid we populate req.user, otherwise
 * we silently continue. Used for endpoints that return richer data for logged-in
 * users (e.g., a "saved" flag on campaigns) but still serve anonymous callers.
 */
const optionalAuth = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = { userId: decoded.userId, role: decoded.role };
  } catch {
    /* ignore, treat as anonymous */
  }
  return next();
};

module.exports = { authMiddleware, roleMiddleware, optionalAuth };
