const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true // This allows multiple null values
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  readTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
BlogSchema.pre('save', function(next) {
  // Calculate read time
  const wordsPerMinute = 200;
  const wordCount = this.content.split(' ').length;
  this.readTime = Math.ceil(wordCount / wordsPerMinute);
  
  // Generate slug from title
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    // Add timestamp to ensure uniqueness
    if (this.isNew) {
      this.slug += '-' + Date.now();
    }
  }
  
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);
