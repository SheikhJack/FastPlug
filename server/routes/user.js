const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { userValidation, sanitizeInput } = require('../middleware/validation');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update profile
router.put('/profile', 
  authenticateToken,
  sanitizeInput,
  userValidation.updateProfile, async (req, res) => {
  try {
    const { name, phone, is_Active } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, is_Active },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update address
router.put('/address', 
  authenticateToken,
  userValidation.updateAddress, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.addresses = req.body.addresses || [];
    await user.save();

    res.json({
      success: true,
      data: user.addresses
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete address
router.delete('/address/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add to wishlist
router.post('/wishlist/add', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Product added to wishlist'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove from wishlist
router.post('/wishlist/remove', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    const user = await User.findById(req.user.userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;