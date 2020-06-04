const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Every tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Every tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Every tour must have a maxximum group size'],
  },
  difficulty: {
    type: 'string',
    required: [true, 'Every tour must have a difficulty'],
  },
  price: {
    type: Number,
    required: [true, 'Every tour must have a price'],
  },
  ratingsAverage: {
    type: Number,
    default: 3,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Every tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Every tour must have a imageCover'],
  },
  images: [String],
  ceratedAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
