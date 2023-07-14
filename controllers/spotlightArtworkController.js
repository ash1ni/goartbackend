const spotlightArtworkModel = require('../models/spotlightArtworkModel');

const spotlightArtworkController = {
  getAllSpotlightArtworks: async (req, res) => {
    try {
      const spotlightArtworks = await spotlightArtworkModel.getAllSpotlightArtworks();
      res.json(spotlightArtworks);
    } catch (error) {
      console.error('Error retrieving spotlight artworks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getSpotlightArtworkById: async (req, res) => {
    const { id } = req.params;

    try {
      const spotlightArtwork = await spotlightArtworkModel.getSpotlightArtworkById(id);
      res.json(spotlightArtwork);
    } catch (error) {
      console.error(`Error retrieving spotlight artwork with ID ${id}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createSpotlightArtwork: async (req, res) => {
    const spotlightArtworkData = req.body;

    try {
      const newSpotlightArtwork = await spotlightArtworkModel.createSpotlightArtwork(spotlightArtworkData);
      res.status(201).json(newSpotlightArtwork);
    } catch (error) {
      console.error('Error creating spotlight artwork:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateSpotlightArtwork: async (req, res) => {
    const { id } = req.params;
    const spotlightArtworkData = req.body;

    try {
      const updatedSpotlightArtwork = await spotlightArtworkModel.updateSpotlightArtwork(id, spotlightArtworkData);
      res.json(updatedSpotlightArtwork);
    } catch (error) {
      console.error(`Error updating spotlight artwork with ID ${id}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteSpotlightArtwork: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedSpotlightArtwork = await spotlightArtworkModel.deleteSpotlightArtwork(id);
      res.json({ message: 'Spotlight artwork deleted successfully' });
    } catch (error) {
      console.error(`Error deleting spotlight artwork with ID ${id}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = spotlightArtworkController;
