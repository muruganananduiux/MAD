const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, message: 'Profile fetched', data: user });
});

const updateProfile = catchAsync(async (req, res) => {
  const { name, phone, address, profileImage } = req.body;
  const user = await User.findByIdAndUpdate(req.userId, { name, phone, address, profileImage }, { new: true }).select('-password');
  res.json({ success: true, message: 'Profile updated', data: user });
});

const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.userId);
  if (!(await user.comparePassword(currentPassword))) throw new ApiError(400, 'Current password incorrect');
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully' });
});

module.exports = { getProfile, updateProfile, changePassword };
