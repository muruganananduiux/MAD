const mongoose = require('mongoose');

/**
 * Token collection is used for:
 *  - `refresh`  : JWT refresh tokens (server-side revocation store)
 *  - `reset`    : password-reset opaque tokens (crypto.randomBytes)
 *  - `verify`   : email verification tokens (future)
 *
 * A TTL index on `expiresAt` auto-purges expired documents. Compound index
 * on (userId, type) keeps lookups fast.
 */
const tokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    token: { type: String, required: true, index: true },
    type: { type: String, enum: ['refresh', 'reset', 'verify'], required: true, default: 'refresh' },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
tokenSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Token', tokenSchema);
