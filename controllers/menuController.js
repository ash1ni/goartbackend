const Menu = require('../models/menuModel');

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { page_id, position } = req.body;

    const createdMenuItem = await Menu.create(page_id, position);

    res.json(createdMenuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const allMenuItems = await Menu.getAll();

    res.json(allMenuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await Menu.getById(id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a menu item by ID
exports.updateMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page_id, position } = req.body;

    const updatedMenuItem = await Menu.updateById(id, page_id, position);

    if (!updatedMenuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(updatedMenuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a menu item by ID
exports.deleteMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const isDeleted = await Menu.deleteById(id);

    if (!isDeleted) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
