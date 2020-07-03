const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const Tour = require('../../models/tourModel');

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

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/tours.json'), 'utf-8')
);

// delete all data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//import all data from json to db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const verb = process.argv[2];
console.log(verb);

if (verb === '--delete') {
  deleteData();
} else if (verb === '--import') {
  importData();
}
