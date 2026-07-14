const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendSuccessResponse } = require('../utils/response.utils');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/jwt.utils');
const User = require('../models/User');
const Token = require('../models/Token');
const { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } = require('../services/email.service');
const crypto = require('crypto');

const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) throw new ApiError(400, 'User already exists');
  const user = await User.create({ name, email, password });
  const token = generateToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });
  await Token.create({ userId: user._id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  await sendWelcomeEmail(user);
  res.status(201).json({ success: true, message: 'User registered successfully', data: { token, refreshToken, user: { id: user._id, name: user.name, email: user.email } } });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) throw new ApiError(400, 'Invalid credentials');
  const token = generateToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });
  await Token.create({ userId: user._id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  res.json({ success: true, message: 'Login successful', data: { token, refreshToken, user: { id: user._id, name: user.name, email: user.email } } });
});

const logout = catchAsync(async (req, res) => {
  await Token.deleteMany({ userId: req.userId });
  res.json({ success: true, message: 'Logout successful' });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new ApiError(400, 'Refresh token required');
  const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
  const tokenDoc = await Token.findOne({ userId: decoded.userId, token });
  if (!tokenDoc) throw new ApiError(401, 'Invalid refresh token');
  const newToken = generateToken({ userId: decoded.userId });
  res.json({ success: true, message: 'Token refreshed', data: { token: newToken } });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenDoc = await Token.create({ userId: user._id, token: resetToken, expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000) });
  await sendPasswordResetEmail(user, resetToken);
  res.json({ success: true, message: 'Password reset link sent to email' });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) throw new ApiError(400, 'Token and new password required');
  const tokenDoc = await Token.findOne({ token, expiresAt: { $gt: Date.now() } });
  if (!tokenDoc) throw new ApiError(400, 'Invalid or expired token');
  const user = await User.findById(tokenDoc.userId);
  user.password = newPassword;
  await user.save();
  await Token.deleteOne({ _id: tokenDoc._id });
  res.json({ success: true, message: 'Password reset successfully' });
});

module.exports = { register, login, logout, refreshToken, forgotPassword, resetPassword };
