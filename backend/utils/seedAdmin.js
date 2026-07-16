const User = require('../models/User');
const logger = require('./logger');

/**
 * Idempotent admin seeder. Creates an admin from ADMIN_EMAIL / ADMIN_PASSWORD
 * env vars on first boot if no admin exists. Safe to run on every startup.
 */
async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'MAD Admin';

  if (!email || !password) {
    logger.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin seed');
    return null;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    // Ensure the role is admin (in case the record was demoted). Do NOT reset password.
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      logger.info(`Elevated existing user ${email} to admin`);
    }
    return existing;
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: 'admin',
    isVerified: true,
    verifiedAt: new Date(),
  });
  logger.info(`Seeded admin user ${email}`);
  return admin;
}

module.exports = { seedAdmin };
