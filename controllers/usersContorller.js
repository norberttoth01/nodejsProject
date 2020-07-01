const AppError = require('../utils/AppError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) filteredObj[el] = obj[el];
  });
  return filteredObj;
};

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'succes',
    data: {
      users,
    },
  });
});

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

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new AppError(
        'This route is not for password updates. Please, use /udateMyPassword route'
      ),
      400
    );
  }
  // nem adhatjuk át módisításra a teljes body-t, mivel így a user módosíthatna security adatokat pl a role-t.
  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // a módosított dokumentummal tér vissza, nem az eredetivel
    runValidators: true, // csak a módosítotakat validálja
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'succes',
    data: null,
  });
});

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'succes',
    data: 'update user',
    id: req.params.id,
  });
};
