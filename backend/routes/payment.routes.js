const express = require('express');
const { createPaymentOrder, verifyPaymentSignature } = require('../controllers/payment.controller');

const router = express.Router();

router.post('/create-order', createPaymentOrder);
router.post('/verify-signature', verifyPaymentSignature);

module.exports = router;
