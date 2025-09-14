const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { authValidation, validateSocialLogin, sanitizeInput } = require('../middleware/validation');

const { generateToken } = require('../middleware/auth');

const router = express.Router();

// const generateToken = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
// };

// Login
router.post('/login',
  sanitizeInput,
  validateSocialLogin,
  authValidation.login, 
  async (req, res) => {
    try {
      const { email, password, facebookId, appleId, type, name, notificationToken } = req.body;

      let user;
      
      if (type === 'email') {
        user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
          return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
      } else if (type === 'facebook' && facebookId) {
        user = await User.findOne({ facebookId });
        if (!user) {
          // Create new user for social login
          user = new User({
            name,
            email,
            facebookId,
            notificationToken,
            is_Active: true
          });
          await user.save();
        }
      } else if (type === 'apple' && appleId) {
        user = await User.findOne({ appleId });
        if (!user) {
          user = new User({
            name,
            email,
            appleId,
            notificationToken,
            is_Active: true
          });
          await user.save();
        }
      } else {
        return res.status(400).json({ success: false, error: 'Invalid login type' });
      }

      if (!user.is_Active) {
        return res.status(401).json({ success: false, error: 'Account is deactivated' });
      }

      const token = generateToken(user._id);
      
      res.json({
        success: true,
        data: {
          userId: user._id,
          token,
          tokenExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          is_Active: user.is_Active
        }
      });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Register
router.post('/register', 
  sanitizeInput,
  authValidation.register, 
  async (req, res) => {
    try {
      const { name, email, phone, password, notificationToken } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User already exists' });
      }

      const user = new User({
        name,
        email,
        phone,
        password,
        notificationToken,
        is_Active: true
      });

      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        data: {
          userId: user._id,
          token,
          tokenExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          is_Active: user.is_Active
        }
      });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Forgot Password
router.post('/forgot-password',
  sanitizeInput,
  authValidation.forgotPassword, 
  async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Here you would typically send a password reset email
      // For now, we'll just return success
      res.json({ success: true, message: 'Password reset instructions sent' });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Refresh token required' 
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET + '_refresh');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = user.generateRefreshToken();

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    });

  } catch (error) {
    res.status(403).json({ 
      success: false, 
      error: 'Invalid refresh token' 
    });
  }
});

module.exports = router;