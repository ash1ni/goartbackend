// routes/users.js
const express = require('express');
const router = express.Router();
const { createUser, loginUser, getUserProfile } = require('../controllers/usersController');

// POST /users
router.post('/', createUser);

// POST /users/login
router.post('/login', loginUser);

// GET /users/profile
router.get('/profile', getUserProfile);

module.exports = router;
