//const dotenv =
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

//dotenv.config({ path: './config.env' });
const app = require('./app');
process.on('uncaughtException', () => {
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connection is made');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`app is running on port ${port} `);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
