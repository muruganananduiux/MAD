const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  ngoName: { type: String, required: true, trim: true, index: true },
  ownerName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true },
  description: { type: String, trim: true },
  address: { type: String, trim: true },
  panNumber: { type: String, trim: true },
  registrationNumber: { type: String, trim: true },
  documents: [{ type: String }],
  logo: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Ngo', ngoSchema);
