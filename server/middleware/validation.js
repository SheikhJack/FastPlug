const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array()
    });
  };
};

const authValidation = {
  login: validate([
    body('type')
      .isIn(['email', 'facebook', 'apple'])
      .withMessage('Type must be email, facebook, or apple'),
    
    body('email')
      .if(body('type').equals('email'))
      .isEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .if(body('type').equals('email'))
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ]),

  register: validate([
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    
    body('phone')
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ]),

  forgotPassword: validate([
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
  ])
};

const userValidation = {
  updateProfile: validate([
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    
    body('is_Active')
      .optional()
      .isBoolean()
      .withMessage('is_Active must be a boolean value')
  ]),

  updateAddress: validate([
    body('addresses')
      .isArray()
      .withMessage('Addresses must be an array'),
    
    body('addresses.*.street')
      .notEmpty()
      .withMessage('Street is required'),
    
    body('addresses.*.city')
      .notEmpty()
      .withMessage('City is required'),
    
    body('addresses.*.zipCode')
      .notEmpty()
      .withMessage('Zip code is required')
  ])
};

const orderValidation = {
  placeOrder: validate([
    body('products')
      .isArray({ min: 1 })
      .withMessage('Products array must contain at least one item'),
    
    body('products.*.productId')
      .notEmpty()
      .withMessage('Product ID is required'),
    
    body('products.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    
    body('products.*.price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('totalAmount')
      .isFloat({ min: 0 })
      .withMessage('Total amount must be a positive number'),
    
    body('shippingAddress')
      .isObject()
      .withMessage('Shipping address is required'),
    
    body('paymentMethod')
      .notEmpty()
      .withMessage('Payment method is required')
  ])
};

const validateSocialLogin = (req, res, next) => {
  const { type, facebookId, appleId, name } = req.body;

  if (type === 'facebook' && !facebookId) {
    return res.status(400).json({
      success: false,
      error: 'Facebook ID is required for Facebook login'
    });
  }

  if (type === 'apple' && !appleId) {
    return res.status(400).json({
      success: false,
      error: 'Apple ID is required for Apple login'
    });
  }

  if ((type === 'facebook' || type === 'apple') && !name) {
    return res.status(400).json({
      success: false,
      error: 'Name is required for social login'
    });
  }

  next();
};

const sanitizeInput = (req, res, next) => {
  if (req.body.name) req.body.name = req.body.name.trim();
  if (req.body.email) req.body.email = req.body.email.toLowerCase().trim();
  if (req.body.phone) req.body.phone = req.body.phone.trim();
  
  next();
};

const handleValidationErrors = (err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  next(err);
};

const categoryValidation = {
  create: validate([
    // ... validation rules from above
  ]),
  update: validate([
    // ... validation rules from above
  ])
};

const productValidation = {
  create: validate([
    // ... validation rules from above
  ]),
  update: validate([
    // ... validation rules from above
  ])
};

module.exports = {
  validate,
  authValidation,
  userValidation,
  orderValidation,
  validateSocialLogin,
  sanitizeInput,
  handleValidationErrors,
  categoryValidation,
  productValidation, 
};