const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true, trim: true },
  goalAmount: { type: Number, required: true, min: 0 },
  raisedAmount: { type: Number, default: 0 },
  coverImage: { type: String },
  gallery: [{ type: String }],
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo', required: true },
  category: { type: String, trim: true, index: true },
  status: { type: String, enum: ['draft', 'active', 'completed', 'cancelled'], default: 'active' },
  location: { type: String, trim: true, index: true },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

campaignSchema.index({ title: 'text', description: 'text', category: 'text', location: 'text' });

module.exports = mongoose.model('Campaign', campaignSchema);
