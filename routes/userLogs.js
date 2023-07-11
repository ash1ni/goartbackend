// routes/userLogs.js
const express = require('express');
const router = express.Router();
const {
  createUserLog,
  getAllUserLogs,
  getUserLogById,
} = require('../controllers/userLogsController');

// Create a new user log
router.post('/', createUserLog);

// Get all user logs
router.get('/', getAllUserLogs);

// Get a specific user log by ID
router.get('/:id', getUserLogById);

module.exports = router;
