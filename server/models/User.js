const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: function() {
      return !this.facebookId && !this.appleId;
    }
  },
  facebookId: {
    type: String,
    sparse: true
  },
  appleId: {
    type: String,
    sparse: true
  },
  notificationToken: {
    type: String,
    default: ''
  },
  is_Active: {
    type: Boolean,
    default: true
  },
  addresses: [{
    type: mongoose.Schema.Types.Mixed,
    default: []
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};


// Generate refresh token method (optional)
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET + '_refresh', // Different secret for refresh tokens
    { expiresIn: '30d' } // Longer expiration for refresh tokens
  );
};


module.exports = mongoose.model('User', userSchema);