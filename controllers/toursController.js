const ApiFeatures = require('../utils/apiFeatures');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //EXECUTE THE QUERY
  const apiFeatures = new ApiFeatures(Tour.find(), req.query);
  apiFeatures.filter().fields().sort().paginate();
  const tours = await apiFeatures.query;
  //SEND RESPONSE

  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // await Tour.findOne({_id=req.params.id})
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour },

    id: req.params.id,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({ status: 'success', data: { tour: newTour } });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) {
    return next(new AppError('No tour found with that ID'), 404);
  }

  res.status(200).json({
    status: 'success',
    data: { tour: updatedTour },
    id: req.params.id,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID'), 404);
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
