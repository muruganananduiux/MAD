const catchAsync = require('../utils/catchAsync');
const Campaign = require('../models/Campaign');
const Ngo = require('../models/Ngo');
const User = require('../models/User');

const searchCampaigns = catchAsync(async (req, res) => {
  const { q } = req.query;
  const campaigns = await Campaign.find({ $text: { $search: q } }).populate('ngoId');
  res.json({ success: true, message: 'Campaigns found', data: campaigns });
});

const searchNgos = catchAsync(async (req, res) => {
  const { q } = req.query;
  const ngos = await Ngo.find({ $or: [{ ngoName: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }] });
  res.json({ success: true, message: 'NGOs found', data: ngos });
});

const searchUsers = catchAsync(async (req, res) => {
  const { q } = req.query;
  const users = await User.find({ $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }] }).select('-password');
  res.json({ success: true, message: 'Users found', data: users });
});

module.exports = { searchCampaigns, searchNgos, searchUsers };
