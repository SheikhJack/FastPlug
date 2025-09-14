const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const orderRoutes = require('./orders');
const userRoutes = require('./user');
const categoryRoutes = require('./categories'); 
const productRoutes = require('./products'); 

router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/user', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes); 

module.exports = router;