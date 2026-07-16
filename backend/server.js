const path = require('path');
const dotenv = require('dotenv');

// Load .env from the backend directory regardless of CWD
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = require('./app');
const { connectDB } = require('./config/db.config');
const { seedAdmin } = require('./utils/seedAdmin');
const logger = require('./utils/logger');

const PORT = Number(process.env.PORT) || 8001;
const HOST = '0.0.0.0';

async function start() {
  try {
    await connectDB();
    await seedAdmin();
    const server = app.listen(PORT, HOST, () => {
      logger.info(`MAD backend listening on http://${HOST}:${PORT}`);
    });

    const shutdown = (signal) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
