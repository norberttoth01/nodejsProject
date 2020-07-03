const Review = require('../models/reviewModel');
const catchAync = require('../utils/catchAsync');

exports.getAllReviews = catchAync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'succes',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAync(async (req, res, next) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
