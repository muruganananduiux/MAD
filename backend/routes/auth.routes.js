const express = require('express');
const { register, login, logout, refreshToken, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/index');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', authMiddleware, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
