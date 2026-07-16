const express = require('express');
const { getDashboardStats, getLatestUsers, getLatestCampaigns, deleteUser, deleteCampaign } = require('../controllers/admin.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, roleMiddleware('admin'), getDashboardStats);
router.get('/latest-users', authMiddleware, roleMiddleware('admin'), getLatestUsers);
router.get('/latest-campaigns', authMiddleware, roleMiddleware('admin'), getLatestCampaigns);
router.delete('/users/:userId', authMiddleware, roleMiddleware('admin'), deleteUser);
router.delete('/campaigns/:campaignId', authMiddleware, roleMiddleware('admin'), deleteCampaign);

module.exports = router;
