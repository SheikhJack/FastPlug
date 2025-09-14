// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

const productValidation = {
  create: validate([
    body('title')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Title must be between 2 and 100 characters'),
    
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('originalPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Original price must be a positive number'),
    
    body('image')
      .isURL()
      .withMessage('Image must be a valid URL'),
    
    body('category')
      .isMongoId()
      .withMessage('Valid category ID is required'),
    
    body('stockQuantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock quantity must be a positive integer'),
    
    body('sku')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('SKU must be between 3 and 20 characters')
  ]),

  update: validate([
    body('title')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Title must be between 2 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('originalPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Original price must be a positive number'),
    
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL'),
    
    body('stockQuantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock quantity must be a positive integer'),
    
    body('sku')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('SKU must be between 3 and 20 characters'),
    
    body('featured')
      .optional()
      .isBoolean()
      .withMessage('Featured must be a boolean'),
    
    body('inStock')
      .optional()
      .isBoolean()
      .withMessage('inStock must be a boolean'),
    
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean')
  ])
};

router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      featured,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeInactive = 'false'
    } = req.query;

    const filter = includeInactive === 'true' ? {} : { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .populate('category', 'title slug')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({
      featured: true,
      isActive: true,
      inStock: true
    })
    .populate('category', 'title slug')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .select('-__v');

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured products'
    });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ],
      isActive: true
    })
    .populate('category', 'title slug description')
    .select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

router.get('/category/:categoryId', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const products = await Product.find({
      category: req.params.categoryId,
      isActive: true
    })
    .populate('category', 'title slug')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-__v');

    const total = await Product.countDocuments({
      category: req.params.categoryId,
      isActive: true
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products by category'
    });
  }
});

router.post('/', authenticateToken, productValidation.create, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }

    req.body.categoryName = category.title;

    const product = new Product(req.body);
    await product.save();
    
    await product.populate('category', 'title slug');

    res.status(201).json({
      success: true,
      data: { product },
      message: 'Product created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Product with this title or SKU already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create product'
    });
  }
});

router.put('/:id', authenticateToken, productValidation.update, async (req, res) => {
  try {
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          error: 'Category not found'
        });
      }
      req.body.categoryName = category.title;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('category', 'title slug')
    .select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product },
      message: 'Product updated successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Product with this title or SKU already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to update product'
    });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete product'
    });
  }
});

router.get('/search/:query', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const products = await Product.find({
      $text: { $search: req.params.query },
      isActive: true
    })
    .populate('category', 'title slug')
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-__v');

    const total = await Product.countDocuments({
      $text: { $search: req.params.query },
      isActive: true
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search products'
    });
  }
});

module.exports = router;