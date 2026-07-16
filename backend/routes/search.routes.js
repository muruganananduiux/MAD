const express = require('express');
const { searchCampaigns, searchNgos, searchUsers } = require('../controllers/search.controller');

const router = express.Router();

router.get('/campaigns', searchCampaigns);
router.get('/ngos', searchNgos);
router.get('/users', searchUsers);

module.exports = router;
