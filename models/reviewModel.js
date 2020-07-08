const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Review cannot be empty'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.statics.calcAverageRatings = async function (tourid) {
  // this points to Review
  const stats = await this.aggregate([
    {
      $match: { tour: tourid },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // ha az admin torli az utolso review-t, akkor a findOneAndDelete metodusra lefuto mw-ben a stats ures tomb lesz
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourid, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourid, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // in post we cannot use next
  this.constructor.calcAverageRatings(this.tour);
});

// a query middleware csak a findOneAnd tipusu metodusokra mukodik a findByidAnd-re nem, de az utobbi az elobbit hasznalja, szoval a controllerben maradhat
// a post query mw-ben a query már végrahajtodott, szoval az eredeti query nem elerheto
reviewSchema.post(/^findOneAnd/, function (doc) {
  //await this.findOne() doesn't work here, beause query was already executed
  if (doc) doc.constructor.calcAverageRatings(doc.tour);
});

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'user',
  //     select: 'name photo',
  //   }).populate({
  //     path: 'tour',
  //     select: 'name',
  //   });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
