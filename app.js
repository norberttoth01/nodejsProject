const express = require('express');
const path = require('path');

const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');
const userRoutes = require('./routes/useresRoutes');
const toursRoutes = require('./routes/toursRoutes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', toursRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
