const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const Ngo = require('../models/Ngo');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

const getDashboardStats = catchAsync(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalNgos = await Ngo.countDocuments();
  const totalCampaigns = await Campaign.countDocuments();
  const totalDonations = await Donation.countDocuments({ paymentStatus: 'paid' });
  const totalAmountRaised = (await Donation.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]))[0]?.total || 0;

  res.json({
    success: true,
    message: 'Dashboard stats',
    data: {
      totalUsers,
      totalNgos,
      totalCampaigns,
      totalDonations,
      totalAmountRaised,
    },
  });
});

const getLatestUsers = catchAsync(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
  res.json({ success: true, message: 'Latest users', data: users });
});

const getLatestCampaigns = catchAsync(async (req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).limit(5);
  res.json({ success: true, message: 'Latest campaigns', data: campaigns });
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  await User.findByIdAndDelete(userId);
  res.json({ success: true, message: 'User deleted' });
});

const deleteCampaign = catchAsync(async (req, res) => {
  const { campaignId } = req.params;
  await Campaign.findByIdAndDelete(campaignId);
  res.json({ success: true, message: 'Campaign deleted' });
});

module.exports = {
  getDashboardStats,
  getLatestUsers,
  getLatestCampaigns,
  deleteUser,
  deleteCampaign,
};
