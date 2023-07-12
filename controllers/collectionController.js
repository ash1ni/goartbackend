const collectionModel = require('../models/collectionModel');
// Get all collections
exports.getAllCollections = async (req, res) => {
    try {
      const collections = await collectionModel.getAllCollections();
      res.json(collections);
    } catch (error) {
      console.error('Error retrieving collections:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
  // Get a collection by ID
  exports.getCollectionById = async (req, res) => {
    const { id } = req.params;
    try {
      const collection = await collectionModel.getCollectionById(id);
      if (!collection) {
        res.status(404).json({ error: 'Collection not found' });
      } else {
        res.json(collection);
      }
    } catch (error) {
      console.error('Error retrieving collection:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
  // Create a new collection
  exports.createCollection = async (req, res) => {
    const { name, status } = req.body;
    try {
      const collection = await collectionModel.createCollection(name, status);
      res.json(collection);
    } catch (error) {
      console.error('Error creating collection:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
  // Update a collection
  exports.updateCollection = async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    try {
      const collection = await collectionModel.updateCollection(id, name, status);
      if (!collection) {
        res.status(404).json({ error: 'Collection not found' });
      } else {
        res.json(collection);
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
  // Delete a collection
  exports.deleteCollection = async (req, res) => {
    const { id } = req.params;
    try {
      const collection = await collectionModel.deleteCollection(id);
      if (!collection) {
        res.status(404).json({ error: 'Collection not found' });
      } else {
        res.json({ message: 'Collection deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
};
  