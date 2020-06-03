const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({ status: 'success', data: tours });
  } catch (err) {
    res.status(400).json({
      status: 'faild',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // await Tour.findOne({_id=req.params.id})
    res.status(200).json({ status: 'success', data: tour, id: req.params.id });
  } catch (err) {
    res.status(400).json({
      status: 'faild',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (err) {
    res.status(400).json({
      status: 'faild',
      message: err,
    });
  }
};

exports.updateTour = (req, res) => {
  res
    .status(500)
    .json({ status: 'success', data: 'update Tour ', id: req.params.id });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'succes',
    data: 'deleted tour',
    id: req.params.id,
  });
};
