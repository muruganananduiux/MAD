const express = require('express');
const { createDonation, getDonationHistory, getCampaignDonations, verifyDonation } = require('../controllers/donation.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, createDonation);
router.get('/history', authMiddleware, getDonationHistory);
router.get('/campaign/:campaignId', getCampaignDonations);
router.post('/verify', authMiddleware, verifyDonation);

module.exports = router;
