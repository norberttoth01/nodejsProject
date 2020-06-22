const express = require('express');
const path = require('path');
const userRoutes = require('./routes/useresRoutes');
const toursRoutes = require('./routes/toursRoutes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', toursRoutes);

app.all('*', (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server`);
  error.statusCode = 404;
  error.status = 'failed';

  next(error);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
