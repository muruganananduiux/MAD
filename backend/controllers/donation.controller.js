const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { generateReceiptNo } = require('../utils/response.utils');
const { sendDonationReceipt } = require('../services/email.service');

const createDonation = catchAsync(async (req, res) => {
  const { campaignId, amount, anonymous } = req.body;
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new ApiError(404, 'Campaign not found');
  const receiptNo = generateReceiptNo();
  const donation = await Donation.create({
    userId: req.userId,
    campaignId,
    amount,
    anonymous,
    receiptNo,
  });
  res.status(201).json({ success: true, message: 'Donation created', data: donation });
});

const getDonationHistory = catchAsync(async (req, res) => {
  const donations = await Donation.find({ userId: req.userId }).populate('campaignId');
  res.json({ success: true, message: 'Donation history', data: donations });
});

const getCampaignDonations = catchAsync(async (req, res) => {
  const { campaignId } = req.params;
  const donations = await Donation.find({ campaignId, paymentStatus: 'paid' });
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  res.json({ success: true, message: 'Campaign donations', data: { donations, totalDonations } });
});

const verifyDonation = catchAsync(async (req, res) => {
  const { donationId, paymentId, orderId, signature } = req.body;
  const donation = await Donation.findById(donationId);
  if (!donation) throw new ApiError(404, 'Donation not found');
  donation.paymentId = paymentId;
  donation.orderId = orderId;
  donation.paymentStatus = 'paid';
  await donation.save();
  const campaign = await Campaign.findById(donation.campaignId);
  campaign.raisedAmount += donation.amount;
  await campaign.save();
  const user = await User.findById(req.userId);
  await sendDonationReceipt(user, donation, campaign);
  res.json({ success: true, message: 'Donation verified', data: donation });
});

module.exports = {
  createDonation,
  getDonationHistory,
  getCampaignDonations,
  verifyDonation,
};
