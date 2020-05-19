const express = require('express');
const path = require('path');
const userRoutes = require('./routes/useresRoutes');
const toursRoutes = require('./routes/toursRoutes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', toursRoutes);

module.exports = app;
