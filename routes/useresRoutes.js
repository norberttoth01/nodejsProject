const express = require('express');
const usersController = require('../controllers/usersContorller');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
///////////////////////////
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/getMe', usersController.getMe, usersController.getUser);
router.patch('/updateMe', usersController.updateMe);
router.delete('/deleteMe', usersController.deleteMe);
///////////////////////////
router.use(authController.restrictedTo('admin'));

router
  .route('/')
  .get(usersController.getAllUser)
  .post(usersController.createUser);

router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
