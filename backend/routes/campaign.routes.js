const express = require('express');
const {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaign,
  getAllCampaigns,
  getPopularCampaigns,
  getFeaturedCampaigns,
  getLatestCampaigns,
} = require('../controllers/campaign.controller');
const { campaignValidator } = require('../validators/index');

const router = express.Router();

router.post('/', campaignValidator, createCampaign);
router.get('/', getAllCampaigns);
router.get('/popular', getPopularCampaigns);
router.get('/featured', getFeaturedCampaigns);
router.get('/latest', getLatestCampaigns);
router.get('/:id', getCampaign);
router.put('/:id', campaignValidator, updateCampaign);
router.delete('/:id', deleteCampaign);

module.exports = router;
