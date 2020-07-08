const Review = require('../models/reviewModel');
const catchAync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAync(async (req, res, next) => {
  let filter = {};
  // akkor nincs tourId, ha a request az /api/v1/reviews url-re erkezik
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'succes',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setTourUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
