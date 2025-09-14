// scripts/seedProducts.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

// Helper function to generate slug from title
const generateSlug = (title) => {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/-+/g, '-') // replace multiple - with single -
    .trim('-');
  
  // Ensure slug is not empty
  if (slug.length === 0) {
    // If slug is empty after processing, use a fallback
    slug = `product-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  }
  
  return slug;
};

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get categories to assign to products
    const categories = await Category.find({});
    if (categories.length === 0) {
      console.log('No categories found. Please seed categories first.');
      process.exit(1);
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    const sampleProducts = [
      {
        title: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced camera system and A17 Pro chip',
        price: 999,
        originalPrice: 1099,
        image: 'https://images.unsplash.com/photo-1695048133142-4e8cf5f49309?w=500',
        category: categories.find(c => c.title === 'Electronics')._id,
        categoryName: 'Electronics',
        featured: true,
        stockQuantity: 50,
        sku: 'IPH15PRO001',
        tags: ['smartphone', 'apple', 'premium'],
        specifications: {
          'Storage': '128GB',
          'Color': 'Titanium',
          'Camera': '48MP'
        }
      },
      {
        title: 'Nike Air Max',
        description: 'Comfortable running shoes with air cushioning',
        price: 120,
        originalPrice: 150,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        category: categories.find(c => c.title === 'Sports')._id,
        categoryName: 'Sports',
        featured: true,
        stockQuantity: 100,
        sku: 'NIKEAM001',
        tags: ['shoes', 'running', 'sports'],
        specifications: {
          'Size': 'US 9',
          'Color': 'Black/White',
          'Material': 'Mesh'
        }
      },
      {
        title: 'Stainless Steel Cookware Set',
        description: '10-piece premium cookware set for professional cooking',
        price: 299,
        originalPrice: 399,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
        category: categories.find(c => c.title === 'Home & Kitchen')._id,
        categoryName: 'Home & Kitchen',
        featured: true,
        stockQuantity: 30,
        sku: 'COOKSET001',
        tags: ['kitchen', 'cookware', 'premium'],
        specifications: {
          'Pieces': '10',
          'Material': 'Stainless Steel',
          'Type': 'Non-stick'
        }
      },
      {
        title: 'Cotton T-Shirt',
        description: '100% cotton comfortable t-shirt for everyday wear',
        price: 25,
        originalPrice: 35,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        category: categories.find(c => c.title === 'Clothing')._id,
        categoryName: 'Clothing',
        featured: false,
        stockQuantity: 200,
        sku: 'COTTONTS001',
        tags: ['clothing', 'casual', 'cotton'],
        specifications: {
          'Size': 'M',
          'Color': 'White',
          'Material': '100% Cotton'
        }
      },
      {
        title: 'Best Selling Novel',
        description: 'Award-winning fiction novel by bestselling author',
        price: 15,
        originalPrice: 20,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        category: categories.find(c => c.title === 'Books')._id,
        categoryName: 'Books',
        featured: true,
        stockQuantity: 75,
        sku: 'BOOK001',
        tags: ['fiction', 'bestseller', 'novel'],
        specifications: {
          'Pages': '320',
          'Format': 'Paperback',
          'Genre': 'Fiction'
        }
      },
      {
        title: 'Wireless Headphones',
        description: 'Noise-cancelling wireless headphones with premium sound',
        price: 199,
        originalPrice: 249,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: categories.find(c => c.title === 'Electronics')._id,
        categoryName: 'Electronics',
        featured: true,
        stockQuantity: 40,
        sku: 'HEADPH001',
        tags: ['audio', 'wireless', 'premium'],
        specifications: {
          'Battery': '30 hours',
          'Connectivity': 'Bluetooth 5.0',
          'Noise Cancelling': 'Yes'
        }
      },
      {
        title: 'Yoga Mat',
        description: 'Eco-friendly yoga mat with non-slip surface',
        price: 45,
        originalPrice: 60,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
        category: categories.find(c => c.title === 'Sports')._id,
        categoryName: 'Sports',
        featured: false,
        stockQuantity: 80,
        sku: 'YOGAMAT001',
        tags: ['yoga', 'fitness', 'eco-friendly'],
        specifications: {
          'Thickness': '5mm',
          'Material': 'Eco-friendly TPE',
          'Size': '72" x 24"'
        }
      },
      {
        title: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe',
        price: 89,
        originalPrice: 120,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
        category: categories.find(c => c.title === 'Home & Kitchen')._id,
        categoryName: 'Home & Kitchen',
        featured: true,
        stockQuantity: 25,
        sku: 'COFFEE001',
        tags: ['coffee', 'kitchen', 'appliance'],
        specifications: {
          'Capacity': '12 cups',
          'Programmable': 'Yes',
          'Carafe': 'Thermal'
        }
      }
    ];

    // Insert sample products one by one to handle errors
    for (const productData of sampleProducts) {
      try {
        // Generate slug for the product
        productData.slug = generateSlug(productData.title);
        
        const product = new Product(productData);
        await product.save();
        console.log(`Created product: ${product.title} (${product.sku})`);
      } catch (error) {
        if (error.code === 11000) {
          // Handle duplicate slug or SKU by generating new ones
          productData.slug = generateSlug(productData.title);
          productData.sku = `${productData.sku}-${Math.random().toString(36).substr(2, 3)}`;
          
          const product = new Product(productData);
          await product.save();
          console.log(`Created product with new slug/SKU: ${product.title}`);
        } else {
          console.error(`Error creating product ${productData.title}:`, error.message);
        }
      }
    }

    console.log('Products seeded successfully');
    console.log(`Created ${sampleProducts.length} sample products`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedProducts();
}

module.exports = { generateSlug, seedProducts };