exports.getAllUser = (req, res) => {
  res.status(500).json({ status: 'succes', data: 'all user' });
};

exports.createUser = (req, res) => {
  res.status(201).json({ status: 'succes', data: ' user created' });
};

exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'succes',
    data: 'just one user',
    id: req.params.id,
  });
};

exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'succes',
    data: 'deleted user',
    id: req.params.id,
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'succes',
    data: 'update user',
    id: req.params.id,
  });
};
