// routes/pages.js
const express = require('express');
const router = express.Router();
const {
  createPage,
  getAllPages,
  getPageById,
  updatePageById,
  deletePageById,
} = require('../controllers/pagesController');

// Create a new page
router.post('/', createPage);

// Get all pages
router.get('/', getAllPages);

// Get a specific page by ID
router.get('/:id', getPageById);

// Update a page by ID
router.put('/:id', updatePageById);

// Delete a page by ID
router.delete('/:id', deletePageById);

module.exports = router;
