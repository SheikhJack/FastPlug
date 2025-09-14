const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required',
      message: 'Please provide a valid authentication token'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT verification error:', err.message);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          error: 'Token expired',
          message: 'Your session has expired. Please login again.'
        });
      }
      
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ 
          success: false, 
          error: 'Invalid token',
          message: 'Invalid authentication token.'
        });
      }

      return res.status(403).json({ 
        success: false, 
        error: 'Token verification failed',
        message: 'Failed to authenticate token.'
      });
    }

    // Attach user information to the request
    req.user = {
      userId: decoded.userId,
      // You can add more user data here if needed
    };
    
    next();
  });
};

// Optional: Middleware to generate tokens (can be used in your auth routes)
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
    }
  );
};

// Optional: Middleware to decode token without verification (for optional auth)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = {
          userId: decoded.userId,
        };
      }
    });
  }
  
  next();
};

module.exports = { 
  authenticateToken, 
  generateToken,
  optionalAuth 
};