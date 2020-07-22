const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tours/:tour', authController.isLoggedIn, viewController.getTour);
router.get('/login', viewController.login);
router.get('/signup', viewController.login);
router.get('/forgotPassword', viewController.login);
router.get('/me', authController.protect, viewController.getAccount);

module.exports = router;
