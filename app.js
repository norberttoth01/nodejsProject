const express = require('express');
const userRoutes = require('./routes/useresRoutes');
const toursRoutes = require('./routes/toursRoutes');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', toursRoutes);

app.listen(port, () => {
  console.log(`app is running on port ${port} `);
});
