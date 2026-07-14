const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const ngoRoutes = require('./routes/ngo.routes');
const campaignRoutes = require('./routes/campaign.routes');
const donationRoutes = require('./routes/donation.routes');
const adminRoutes = require('./routes/admin.routes');
const paymentRoutes = require('./routes/payment.routes');
const searchRoutes = require('./routes/search.routes');

const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MAD NGO Donation Platform API',
    version: '1.0.0',
    description: 'API documentation for the MAD backend',
  },
  servers: [{ url: 'http://localhost:5000' }],
};
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./routes/*.js', './models/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use(limiter);

app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize(req.body);
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.json({ success: true, message: 'MAD NGO backend is running.' }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
