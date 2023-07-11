const Page = require('../models/pageModel');

// Create a new page
exports.createPage = async (req, res) => {
  try {
    const { slug, title, description, content, tags, meta, show_in_menu, status } = req.body;

    const newPage = {
      slug,
      title,
      description,
      content,
      tags,
      meta,
      show_in_menu,
      status,
    };

    const createdPage = await Page.create(newPage);

    res.json(createdPage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const allPages = await Page.getAll();

    res.json(allPages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific page by ID
exports.getPageById = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await Page.getById(id);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a page by ID
exports.updatePageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, title, description, content, tags, meta, show_in_menu, status } = req.body;

    const updatedPage = await Page.updateById(id, {
      slug,
      title,
      description,
      content,
      tags,
      meta,
      show_in_menu,
      status,
    });

    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(updatedPage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a page by ID
exports.deletePageById = async (req, res) => {
  try {
    const { id } = req.params;

    const isDeleted = await Page.deleteById(id);

    if (!isDeleted) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ message: 'Page deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
