const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Campaign = require('../models/Campaign');

const createCampaign = catchAsync(async (req, res) => {
  const { title, description, goalAmount, category, location, deadline, ngoId } = req.body;
  const campaign = await Campaign.create({ title, description, goalAmount, category, location, deadline, ngoId });
  res.status(201).json({ success: true, message: 'Campaign created', data: campaign });
});

const updateCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findByIdAndUpdate(id, req.body, { new: true });
  if (!campaign) throw new ApiError(404, 'Campaign not found');
  res.json({ success: true, message: 'Campaign updated', data: campaign });
});

const deleteCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findByIdAndDelete(id);
  if (!campaign) throw new ApiError(404, 'Campaign not found');
  res.json({ success: true, message: 'Campaign deleted' });
});

const getCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findById(id).populate('ngoId');
  if (!campaign) throw new ApiError(404, 'Campaign not found');
  res.json({ success: true, message: 'Campaign fetched', data: campaign });
});

const getAllCampaigns = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, category, location, sortBy = 'createdAt' } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (location) filter.location = location;
  const campaigns = await Campaign.find(filter).sort(sortBy === 'popular' ? { raisedAmount: -1 } : { [sortBy]: -1 }).limit(limit * 1).skip((page - 1) * limit).populate('ngoId');
  const total = await Campaign.countDocuments(filter);
  res.json({ success: true, message: 'Campaigns fetched', data: { campaigns, total, pages: Math.ceil(total / limit) } });
});

const getPopularCampaigns = catchAsync(async (req, res) => {
  const campaigns = await Campaign.find().sort({ raisedAmount: -1 }).limit(5).populate('ngoId');
  res.json({ success: true, message: 'Popular campaigns', data: campaigns });
});

const getFeaturedCampaigns = catchAsync(async (req, res) => {
  const campaigns = await Campaign.find({ status: 'active' }).limit(6).populate('ngoId');
  res.json({ success: true, message: 'Featured campaigns', data: campaigns });
});

const getLatestCampaigns = catchAsync(async (req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).limit(5).populate('ngoId');
  res.json({ success: true, message: 'Latest campaigns', data: campaigns });
});

module.exports = {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaign,
  getAllCampaigns,
  getPopularCampaigns,
  getFeaturedCampaigns,
  getLatestCampaigns,
};
