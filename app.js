const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');
const userRoutes = require('./routes/useresRoutes');
const toursRoutes = require('./routes/toursRoutes');

const app = express();

const limiter = rateLimit({
  max: 100,
  windonMs: 60 * 60 * 1000,
  message: 'Too mny request from this IP. Please, try again in an hour',
});
// SET SECURITY HTTP HEADERS
app.use(helmet());

// LIMIT REQUEST FROM THE SAME IP
app.use('/api', limiter);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10kb' }));

//Data sanitization againts NoSQL query injection
app.use(mongoSanitize());
// Data sanitization againts XSS
app.use(xss());
// prevent from http params pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', toursRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
