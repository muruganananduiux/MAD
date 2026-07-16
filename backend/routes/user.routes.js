const express = require('express');
const { getProfile, updateProfile, changePassword } = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { profileValidator, changePasswordValidator } = require('../validators/index');

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, profileValidator, updateProfile);
router.put('/change-password', authMiddleware, changePasswordValidator, changePassword);

module.exports = router;
