const express = require('express');
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');
const { orderValidation } = require('../middleware/validation'); // Add this import

const router = express.Router();

// Get orders with pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = 10;

    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('products.productId');

    res.json({
      success: true,
      data: { orders }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.userId
    }).populate('products.productId');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Place order with validation
router.post('/', 
  authenticateToken,
  orderValidation.placeOrder, // Now this should work
  async (req, res) => {
    try {
      const orderData = {
        ...req.body,
        userId: req.user.userId
      };

      const order = new Order(orderData);
      await order.save();

      const populatedOrder = await Order.findById(order._id).populate('products.productId');

      res.status(201).json({
        success: true,
        data: { order: populatedOrder }
      });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

module.exports = router;