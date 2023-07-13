const pickArtworkModel = require('../models/pickArtworkModel');

// Get all pick artworks
const getAllPickArtworks = async (req, res) => {
  try {
    const pickArtworks = await pickArtworkModel.getAllPickArtworks();
    res.json(pickArtworks);
  } catch (error) {
    console.error('Error retrieving pick artworks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a pick artwork by ID
const getPickArtworkById = async (req, res) => {
  const { id } = req.params;
  try {
    const pickArtwork = await pickArtworkModel.getPickArtworkById(id);
    if (!pickArtwork) {
      return res.status(404).json({ error: 'Pick artwork not found' });
    }
    res.json(pickArtwork);
  } catch (error) {
    console.error('Error retrieving pick artwork:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new pick artwork
const createPickArtwork = async (req, res) => {
  const { artwork_id, position, status } = req.body;
  try {
    const newPickArtwork = await pickArtworkModel.createPickArtwork(
      artwork_id,
      position,
      status
    );
    res.status(201).json(newPickArtwork);
  } catch (error) {
    console.error('Error creating pick artwork:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a pick artwork by ID
const updatePickArtwork = async (req, res) => {
  const { id } = req.params;
  const { artwork_id, position, status } = req.body;
  try {
    const updatedPickArtwork = await pickArtworkModel.updatePickArtwork(
      id,
      artwork_id,
      position,
      status
    );
    if (!updatedPickArtwork) {
      return res.status(404).json({ error: 'Pick artwork not found' });
    }
    res.json(updatedPickArtwork);
  } catch (error) {
    console.error('Error updating pick artwork:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a pick artwork by ID
const deletePickArtwork = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPickArtwork = await pickArtworkModel.deletePickArtwork(id);
    if (!deletedPickArtwork) {
      return res.status(404).json({ error: 'Pick artwork not found' });
    }
    res.json({ message: 'Pick artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting pick artwork:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllPickArtworks,
  getPickArtworkById,
  createPickArtwork,
  updatePickArtwork,
  deletePickArtwork,
};
