const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  authController.isLoggedIn,
  bookingController.createBookingCheckout,
  viewController.getOverview
);
router.get('/tours/:tour', authController.isLoggedIn, viewController.getTour);
router.get('/login', viewController.login);
router.get('/signup', viewController.login);
router.get('/forgotPassword', viewController.login);
router.get('/resetPassword/:resetToken', viewController.login);

router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

module.exports = router;
