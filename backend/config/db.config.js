const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB. Prefer MONGO_URI (full DSN); fall back to
 * MONGO_URL + DB_NAME (Emergent platform convention).
 */
const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  if (!uri) {
    const host = process.env.MONGO_URL;
    const db = process.env.DB_NAME || 'mad_crowdfunding';
    if (!host) throw new Error('MONGO_URI or MONGO_URL is required in .env');
    uri = `${host.replace(/\/$/, '')}/${db}`;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 10000,
  });
  logger.info(`MongoDB connected: ${mongoose.connection.name}`);

  mongoose.connection.on('error', (err) => logger.error('MongoDB error', err));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
};

module.exports = { connectDB };
