const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'UI/UX Design',
        'Business',
        'Marketing',
        'Photography',
        'Music',
        'Other'
      ]
    },
    level: {
      type: String,
      required: [true, 'Course level is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    thumbnail: {
      type: String,
      default: 'https://via.placeholder.com/400x225'
    },
    promoVideo: {
      type: String
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'unpublished'],
      default: 'draft'
    },
    sections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section'
    }],
    totalEnrollments: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for faster searches
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ instructor: 1, status: 1 });

module.exports = mongoose.model('Course', courseSchema);
