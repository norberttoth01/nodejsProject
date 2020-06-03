const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Every tour must have a name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Every tour must have a duration'],
  },
  difficulty: {
    type: 'string',
    required: [true, 'Every tour must have a difficulty'],
  },
  price: {
    type: Number,
    required: [true, 'Every tour must have a price'],
  },
  rating: {
    type: Number,
    default: 3,
  },
});

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
