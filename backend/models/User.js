const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true },
    profileImage: { type: String },
    address: { type: String, trim: true },
    // NOTE: Extended enum to support NGO owners. Existing users default to 'user'.
    role: { type: String, enum: ['user', 'ngo', 'admin'], default: 'user', index: true },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo' },
    savedCampaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject({ versionKey: false });
  delete obj.password;
  return { ...obj, id: obj._id };
};

module.exports = mongoose.model('User', userSchema);
