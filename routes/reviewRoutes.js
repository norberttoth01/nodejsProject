const express = require('express');
const reviewsController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictedTo('user'),
    reviewsController.createReview
  );

module.exports = router;
