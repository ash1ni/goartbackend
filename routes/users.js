// routes/users.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usersController');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUserCredentials);

module.exports = router;
