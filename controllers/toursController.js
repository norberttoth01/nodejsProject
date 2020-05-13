exports.getAllTours = (req, res) => {
  res.status(500).json({ status: 'success', data: 'all tours ' });
};

exports.getTour = (req, res) => {
  res
    .status(500)
    .json({ status: 'success', data: 'just one tour', id: req.params.id });
};

exports.createTour = (req, res) => {
  res.status(500).json({ status: 'success', data: 'create tours ' });
};

exports.updateTour = (req, res) => {
  res
    .status(500)
    .json({ status: 'success', data: 'update Tour ', id: req.params.id });
};

exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'succes',
    data: 'deleted tour',
    id: req.params.id,
  });
};
