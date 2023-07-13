const multimediaModel = require('../models/multimediaModel');

// Controller for getting all multimedia items
const getAllMultimedia = async (req, res) => {
  try {
    const multimedia = await multimediaModel.getAllMultimedia();
    res.json(multimedia);
  } catch (error) {
    console.error('Error retrieving multimedia items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for getting a specific multimedia item by ID
const getMultimediaById = async (req, res) => {
  const { id } = req.params;

  try {
    const multimedia = await multimediaModel.getMultimediaById(id);
    if (!multimedia) {
      return res.status(404).json({ error: 'Multimedia item not found' });
    }
    res.json(multimedia);
  } catch (error) {
    console.error('Error retrieving multimedia item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for creating a new multimedia item
const createMultimedia = async (req, res) => {
  const multimediaData = req.body;

  try {
    const newMultimedia = await multimediaModel.createMultimedia(multimediaData);
    res.status(201).json(newMultimedia);
  } catch (error) {
    console.error('Error creating multimedia item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for updating an existing multimedia item
const updateMultimedia = async (req, res) => {
  const { id } = req.params;
  const multimediaData = req.body;

  try {
    const updatedMultimedia = await multimediaModel.updateMultimedia(
      id,
      multimediaData
    );
    if (!updatedMultimedia) {
      return res.status(404).json({ error: 'Multimedia item not found' });
    }
    res.json(updatedMultimedia);
  } catch (error) {
    console.error('Error updating multimedia item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller for deleting a multimedia item
const deleteMultimedia = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedMultimedia = await multimediaModel.deleteMultimedia(id);
      if (!deletedMultimedia) {
        return res.status(404).json({ error: 'Multimedia item not found' });
      }
      res.json({ message: 'Multimedia item deleted successfully' });
    } catch (error) {
      console.error('Error deleting multimedia item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = {
    getAllMultimedia,
    getMultimediaById,
    createMultimedia,
    updateMultimedia,
    deleteMultimedia,
  };
  
