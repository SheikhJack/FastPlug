// routes/categories.js
const express = require('express');
const Category = require('../models/Category');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

const categoryValidation = {
  create: validate([
    body('title')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Title must be between 2 and 50 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL'),
    
    body('order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Order must be a positive integer')
  ]),

  update: validate([
    body('title')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Title must be between 2 and 50 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL'),
    
    body('order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Order must be a positive integer'),
    
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean')
  ])
};

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    
    const categories = await Category.find(filter)
      .sort({ order: 1, title: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const category = await Category.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ],
      isActive: true
    }).select('-__v');

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category'
    });
  }
});

router.post('/', authenticateToken, categoryValidation.create, async (req, res) => {
  try {
    const existingCategory = await Category.findOne({
      $or: [
        { title: req.body.title },
        { slug: req.body.title?.toLowerCase().replace(/\s+/g, '-') }
      ]
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists'
      });
    }

    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      data: { category },
      message: 'Category created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
});

router.put('/:id', authenticateToken, categoryValidation.update, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category },
      message: 'Category updated successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Category title already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
});

router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      success: true,
      data: { category },
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to toggle category status'
    });
  }
});

module.exports = router;