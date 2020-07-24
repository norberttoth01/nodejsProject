const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Booking = require('../models/bookingModel');

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

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  res.status(200).render('tour', { tour });
});

exports.login = (req, res) => {
  const url = req.url.replace('/', '');
  let btn;
  let title;
  // eslint-disable-next-line default-case
  switch (url) {
    case 'login':
      title = 'Log into your account';
      btn = 'login';
      break;
    case 'signup':
      title = 'Create Your account';
      btn = ' sign up';
      break;
    case 'forgotpassword':
      title = 'Forgotten password';
      btn = 'new password';
      break;
    case url.match(/^resetPassword/) ? url : undefined:
      title = 'Reset your password';
      btn = 'reset password';
  }
  res.status(200).render('login', {
    title,
    url,
    btn,
  });
};

exports.getMyTours = catchAsync(async (req, res) => {
  // alternative for virtual populate
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map((el) => el.tour); // not neccesery to use el.tour.id
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', { title: 'My booked tours', tours });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.forgotPassword = (req, res, next) => {
  res.status(200).render('forgotPassword', { title: 'new password' });
};
