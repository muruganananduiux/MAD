const jwt = require('jsonwebtoken');

const ACCESS_SECRET = () => process.env.JWT_SECRET;
const REFRESH_SECRET = () => process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = () => process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = () => process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Access tokens embed both userId and role so `roleMiddleware`
 * can authorize without an extra DB lookup on every request.
 */
const generateAccessToken = (user) =>
  jwt.sign({ userId: user._id ? String(user._id) : String(user.userId), role: user.role }, ACCESS_SECRET(), {
    expiresIn: ACCESS_EXPIRES(),
  });

const generateRefreshToken = (user) =>
  jwt.sign({ userId: user._id ? String(user._id) : String(user.userId), role: user.role, kind: 'refresh' }, REFRESH_SECRET(), {
    expiresIn: REFRESH_EXPIRES(),
  });

const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET());
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET());

// Convenience: parse expiry to a Date for storing in Mongo
const refreshExpiresAt = () => {
  const raw = REFRESH_EXPIRES();
  const match = /^(\d+)([smhd])$/.exec(raw);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const n = Number(match[1]);
  const mult = { s: 1e3, m: 60e3, h: 3600e3, d: 86400e3 }[match[2]];
  return new Date(Date.now() + n * mult);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshExpiresAt,
  // Backwards-compat exports (old code used these names)
  generateToken: generateAccessToken,
  verifyToken: verifyAccessToken,
};
