const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  amount: { type: Number, required: true, min: 1 },
  paymentId: { type: String, trim: true },
  orderId: { type: String, trim: true },
  receiptNo: { type: String, trim: true },
  paymentStatus: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  paymentMethod: { type: String, trim: true },
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
