const Review = require('../models/reviewModel');
const catchAync = require('../utils/catchAsync');

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

exports.createReview = catchAync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
