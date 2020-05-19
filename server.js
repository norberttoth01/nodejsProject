const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

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

const TourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Every tour must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Every tour must have a price'],
  },
  rating: {
    type: Number,
    default: 3,
  },
});

const Tour = new mongoose.model('Tours', TourSchema);

const testTour = new Tour({
  name: 'test tour 3',
  price: 345,
});

testTour
  .save()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app is running on port ${port} `);
});
