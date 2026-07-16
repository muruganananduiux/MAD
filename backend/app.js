const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/error.middleware');
const logger = require('./utils/logger');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const ngoRoutes = require('./routes/ngo.routes');
const campaignRoutes = require('./routes/campaign.routes');
const donationRoutes = require('./routes/donation.routes');
const adminRoutes = require('./routes/admin.routes');
const paymentRoutes = require('./routes/payment.routes');
const searchRoutes = require('./routes/search.routes');

const app = express();
app.set('trust proxy', 1); // Behind K8s ingress

// --------------------------------------------------------------------------
// Security & platform middleware
// --------------------------------------------------------------------------
app.use(
  helmet({
    // Allow cross-origin embedding of images/documents from Cloudinary etc.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const corsOrigins = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

morgan.token('id', (req) => req.userId || '-');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms user=:id', {
  stream: { write: (m) => logger.http(m.trim()) },
}));

// Serve any local uploads (Cloudinary is preferred, this is a fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global (permissive) rate limit — auth endpoints have their own stricter limiter.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' },
});
app.use('/api/', globalLimiter);

// Sanitize NoSQL injection attempts in body/query/params.
app.use((req, _res, next) => {
  if (req.body) req.body = mongoSanitize(req.body);
  if (req.query) req.query = mongoSanitize(req.query);
  if (req.params) req.params = mongoSanitize(req.params);
  next();
});

// --------------------------------------------------------------------------
// Swagger docs (dev convenience)
// --------------------------------------------------------------------------
const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: { title: 'MAD Crowdfunding API', version: '1.0.0' },
    servers: [{ url: '/' }],
  },
  apis: ['./routes/*.js', './models/*.js'],
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------------------------------------------------------------------
// Health check + routes
// --------------------------------------------------------------------------
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'ok', timestamp: new Date().toISOString() }));
app.get('/', (_req, res) => res.json({ success: true, message: 'MAD Crowdfunding backend is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/search', searchRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
