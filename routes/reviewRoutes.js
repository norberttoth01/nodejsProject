const express = require('express');
const reviewsController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictedTo('user'),
    reviewsController.setTourUserId,
    reviewsController.createReview
  );

router
  .route('/:id')
  .get(reviewsController.getReview)
  .patch(
    authController.restrictedTo('user', 'admin'),
    reviewsController.updateReview
  )
  .delete(
    authController.restrictedTo('user', 'admin'),
    reviewsController.deleteReview
  );

module.exports = router;
