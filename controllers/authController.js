const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_Secret, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};
const createSendToken = (user, res, statusCode) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === 'production', // csak akkor kuldjuk el a cookie-t ha https kapcsolat van
    httpOnly: true, // a browser csak fogadni és kuldeni tudja a cookiet, nem tudja módosítani vagy hozzaferni
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; //hiaba false a select option, create eseten visszakuldi
  user.active = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  createSendToken(newUser, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide your email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, res, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_Secret);

  const currentUser = await User.findById(decoded.id).select('+password');

  if (!currentUser) {
    next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }

  if (currentUser.IsPasswordChangedAfter(decoded.iat)) {
    next(new AppError('User recently changed password. Please log in again'));
  }
  req.user = currentUser;
  next();
});
//just for rendered pages, no error if user is not logged in
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_Secret
    );
    const currentUser = await User.findById(decoded.id).select('+password');
    if (!currentUser) {
      return next();
    }
    if (currentUser.IsPasswordChangedAfter(decoded.iat)) {
      return next();
    }
    res.locals.user = currentUser;
    return next();
  }
  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You have no permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that eamil address', 404));
  }

  const resetToken = user.createResetPasswordToken();

  // we have to save the user what was modified by createResetPassword method
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to ${resetUrl}\n If you didn't forget your password, ignore this email`;

  try {
    await sendmail({
      email: req.body.email,
      subject: 'your reset password token valid for 10 minutes',
      text: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'reset password token is sent',
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('there was an error sending email. Please try later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  createSendToken(user, res, 200);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();
  createSendToken(user, res, 200);
});
