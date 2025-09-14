const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    lowercase: true
  }
}, {
  timestamps: true
});

categorySchema.pre('save', function(next) {
  if (this.isModified('title') && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-') 
      .replace(/-+/g, '-') 
      .trim('-');
  }
  next();
});

categorySchema.index({ title: 1, isActive: 1 });

module.exports = mongoose.model('Category', categorySchema);