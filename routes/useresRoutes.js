const express = require('express');
const usersController = require('../controllers/usersContorller');

const router = express.Router();

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
