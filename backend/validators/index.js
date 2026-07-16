const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ApiError(
        400,
        'Validation failed',
        errors.array().map((e) => ({ field: e.path || e.param, message: e.msg }))
      )
    );
  }
  return next();
};

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 80 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6, max: 128 }).withMessage('Password must be 6-128 characters'),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('role').optional().isIn(['user', 'ngo']).withMessage('Invalid role'),
  validate,
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const profileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 80 }),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('address').optional().trim().isLength({ max: 300 }),
  body('profileImage').optional().isURL().withMessage('profileImage must be a URL'),
  validate,
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6, max: 128 }).withMessage('New password must be 6-128 characters'),
  validate,
];

const campaignValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 5, max: 140 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ min: 20 }),
  body('goalAmount').isFloat({ min: 100 }).withMessage('Goal amount must be at least 100'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('location').optional().trim().isLength({ max: 120 }),
  body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
  body('ngoId').optional().isMongoId().withMessage('Invalid NGO id'),
  body('coverImage').optional().isURL().withMessage('coverImage must be a URL'),
  validate,
];

const donationValidator = [
  body('campaignId').isMongoId().withMessage('Invalid campaign id'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('anonymous').optional().isBoolean(),
  body('message').optional().trim().isLength({ max: 500 }),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  profileValidator,
  changePasswordValidator,
  campaignValidator,
  donationValidator,
  validate,
};
