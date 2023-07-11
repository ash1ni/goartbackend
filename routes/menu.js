// routes/menu.js
const express = require('express');
const router = express.Router();
const {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItemById,
  deleteMenuItemById,
} = require('../controllers/menuController');

// Create a new menu item
router.post('/', createMenuItem);

// Get all menu items
router.get('/', getAllMenuItems);

// Get a specific menu item by ID
router.get('/:id', getMenuItemById);

// Update a menu item by ID
router.put('/:id', updateMenuItemById);

// Delete a menu item by ID
router.delete('/:id', deleteMenuItemById);

module.exports = router;
