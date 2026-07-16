const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const Token = require('../models/Token');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  refreshExpiresAt,
} = require('../utils/jwt.utils');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/email.service');
const logger = require('../utils/logger');

// Rotate refresh tokens: on every /refresh, invalidate the old token and issue a new one.
async function issueAuthTokens(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await Token.create({
    userId: user._id,
    token: refreshToken,
    type: 'refresh',
    expiresAt: refreshExpiresAt(),
  });
  return { accessToken, refreshToken };
}

const register = catchAsync(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(400, 'Account with this email already exists');

  // Public registration cannot self-elevate to admin.
  const safeRole = role === 'ngo' ? 'ngo' : 'user';

  const user = await User.create({ name, email: email.toLowerCase(), password, phone, role: safeRole });
  const { accessToken, refreshToken } = await issueAuthTokens(user);

  // Fire-and-forget welcome email (SMTP may be a placeholder)
  sendWelcomeEmail(user).catch((e) => logger.warn('Welcome email failed', e.message));

  res.status(201).json({
    success: true,
    message: 'Registered successfully',
    data: { token: accessToken, refreshToken, user: user.toSafeJSON() },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const { accessToken, refreshToken } = await issueAuthTokens(user);
  res.json({
    success: true,
    message: 'Login successful',
    data: { token: accessToken, refreshToken, user: user.toSafeJSON() },
  });
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body || {};
  if (refreshToken) {
    await Token.deleteOne({ userId: req.userId, token: refreshToken, type: 'refresh' });
  } else {
    // If no explicit token provided, revoke all refresh tokens for the user.
    await Token.deleteMany({ userId: req.userId, type: 'refresh' });
  }
  res.json({ success: true, message: 'Logged out' });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new ApiError(400, 'Refresh token required');

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const stored = await Token.findOne({ token, type: 'refresh', userId: decoded.userId });
  if (!stored) throw new ApiError(401, 'Refresh token revoked');

  const user = await User.findById(decoded.userId);
  if (!user) throw new ApiError(401, 'User not found');

  // Rotate: invalidate old, issue new pair.
  await Token.deleteOne({ _id: stored._id });
  const { accessToken, refreshToken: newRefresh } = await issueAuthTokens(user);

  res.json({
    success: true,
    message: 'Token refreshed',
    data: { token: accessToken, refreshToken: newRefresh, user: user.toSafeJSON() },
  });
});

const me = catchAsync(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, message: 'Current user', data: { user: user.toSafeJSON() } });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  // Do not leak account existence.
  const generic = { success: true, message: 'If the email exists, a reset link has been sent.' };
  if (!user) return res.json(generic);

  const resetToken = crypto.randomBytes(32).toString('hex');
  await Token.create({
    userId: user._id,
    token: resetToken,
    type: 'reset',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });
  sendPasswordResetEmail(user, resetToken).catch((e) => logger.warn('Reset email failed', e.message));

  return res.json(generic);
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) throw new ApiError(400, 'Token and new password required');
  if (newPassword.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

  const doc = await Token.findOne({ token, type: 'reset', expiresAt: { $gt: new Date() } });
  if (!doc) throw new ApiError(400, 'Invalid or expired reset token');

  const user = await User.findById(doc.userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  user.password = newPassword;
  await user.save();

  await Token.deleteOne({ _id: doc._id });
  // Also revoke all refresh tokens so old sessions can't be used.
  await Token.deleteMany({ userId: user._id, type: 'refresh' });

  res.json({ success: true, message: 'Password reset successful' });
});

module.exports = { register, login, logout, refreshToken, me, forgotPassword, resetPassword };
