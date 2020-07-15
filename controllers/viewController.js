const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'Exciting tours for adventurous people',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tourSlug = req.params.tour;

  const tour = await Tour.findOne({ slug: tourSlug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  res.status(200).render('tour', { tour });
});

exports.login = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};