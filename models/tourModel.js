const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Every tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less then ot equal to 40 characters',
      ],
      minlength: [10, 'A tour name must have more or equal to 10 characters'],
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The difficulty must be easy, medium or difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'Every tour must have a price'],
    },
    ratingsAverage: {
      type: Number,
      default: 3,
      min: [1, 'rating average must be at least 1.0'],
      max: [5, 'rating average must be belowe 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'The discount price must be less then the price',
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual('durationweeks', function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
