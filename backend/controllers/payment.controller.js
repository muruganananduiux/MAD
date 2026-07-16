const catchAsync = require('../utils/catchAsync');
const { createOrder, verifySignature } = require('../services/payment.service');

const createPaymentOrder = catchAsync(async (req, res) => {
  const { amount } = req.body;
  const order = await createOrder(amount);
  res.json({ success: true, message: 'Order created', data: order });
});

const verifyPaymentSignature = catchAsync(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }
  res.json({ success: true, message: 'Signature verified' });
});

module.exports = { createPaymentOrder, verifyPaymentSignature };
