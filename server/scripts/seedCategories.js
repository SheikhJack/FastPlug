// scripts/seedCategories.js
const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

// Helper function to generate slug
const generateSlug = (title) => {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
  
  if (slug.length === 0) {
    slug = `category-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  }
  
  return slug;
};

const sampleCategories = [
  {
    title: 'Electronics',
    description: 'Latest gadgets and electronic devices',
    image: 'https://example.com/electronics.jpg',
    order: 1,
    slug: 'electronics'
  },
  {
    title: 'Clothing',
    description: 'Fashionable clothing for all seasons',
    image: 'https://example.com/clothing.jpg',
    order: 2,
    slug: 'clothing'
  },
  {
    title: 'Home & Kitchen',
    description: 'Everything for your home and kitchen',
    image: 'https://example.com/home-kitchen.jpg',
    order: 3,
    slug: 'home-kitchen'
  },
  {
    title: 'Books',
    description: 'Best selling books and novels',
    image: 'https://example.com/books.jpg',
    order: 4,
    slug: 'books'
  },
  {
    title: 'Sports',
    description: 'Sports equipment and accessories',
    image: 'https://example.com/sports.jpg',
    order: 5,
    slug: 'sports'
  }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert sample categories one by one to handle errors
    for (const categoryData of sampleCategories) {
      try {
        const category = new Category(categoryData);
        await category.save();
        console.log(`Created category: ${category.title}`);
      } catch (error) {
        if (error.code === 11000) {
          // Handle duplicate slug by generating a new one
          categoryData.slug = generateSlug(categoryData.title);
          const category = new Category(categoryData);
          await category.save();
          console.log(`Created category with new slug: ${category.title} (${category.slug})`);
        } else {
          console.error(`Error creating category ${categoryData.title}:`, error.message);
        }
      }
    }

    console.log('Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();