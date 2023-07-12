const Artwork = require('../models/artworkModel');

// Get all artwork
const getAllArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.getAllArtwork();
    res.json(artwork);
  } catch (error) {
    console.error('Error retrieving artwork:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create artwork
const createArtwork = async (req, res) => {
  const artworkData = req.body;
  try {
    const artwork = await Artwork.createArtwork(artworkData);
    res.status(201).json(artwork);
  } catch (error) {
    console.error('Error creating artwork:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get artwork by ID
const getArtworkById = async (req, res) => {
  const artworkId = req.params.id;
  try {
    const artwork = await Artwork.getArtworkById(artworkId);
    res.json(artwork);
  } catch (error) {
    console.error('Error retrieving artwork:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update artwork
const updateArtwork = async (req, res) => {
  const artworkId = req.params.id;
  const artworkData = req.body;
  try {
    const artwork = await Artwork.updateArtwork(artworkId, artworkData);
    res.json(artwork);
  } catch (error) {
    console.error('Error updating artwork:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete artwork
const deleteArtwork = async (req, res) => {
  const artworkId = req.params.id;
  try {
    await Artwork.deleteArtwork(artworkId);
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting artwork:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllArtwork,
  createArtwork,
  getArtworkById,
  updateArtwork,
  deleteArtwork,
};
