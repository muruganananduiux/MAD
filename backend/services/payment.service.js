const crypto = require('crypto');
const { razorpay } = require('../config/razorpay.config');

const createOrder = async (amount, currency = 'INR') => {
  const options = {
    amount: amount * 100,
    currency,
    receipt: `rcpt_${Date.now()}`,
  };
  const order = await razorpay.orders.create(options);
  return order;
};

const verifySignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
  const digest = shasum.digest('hex');
  return digest === razorpaySignature;
};

module.exports = { createOrder, verifySignature };
