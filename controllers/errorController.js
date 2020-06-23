const AppError = require('../utils/AppError');

const handleCasterrorDb = (error) => {
  const message = `Invalid  ${error.path} :  ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDb = (error) => {
  const value = error.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operational error
  if (err.isOperatinal) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming error or other third party error
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, ...{ message: err.message } };

    if (error.name === 'CastError') error = handleCasterrorDb(error);
    if (error.code === 11000) error = handleDuplicateFieldsDb(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDb(error);

    sendErrorProd(error, res);
  }
};
