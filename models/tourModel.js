const mongoose = require('mongoose');
const slugify = require('slugify');

const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Every tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less than or equal to 40 characters',
      ],
      minlength: [
        10,
        'A tour name must have more than or equal to 10 characters',
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Every tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Every tour must have a maximum group size'],
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
      min: [1, 'Rating average must be at least 1.0'],
      max: [5, 'Rating average must be below 5.0'],
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
        message: 'The discount price must be less than the price',
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
    startLocation: {
      //GeoJSON, itt definialjuk a startLocation tipusat, ami egy object, ez tartalmaz egy type property-t aminek a tipusa string
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinate: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinate: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array, in case of embedding
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
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

// tourSchema.pre('save', async function (next) {
//   const guidePromises = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(guidePromises);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
