const artistModel = require('../models/artistModel');
// Get all artists
exports.getAllArtists = async (req, res) => {
    try {
      const artists = await artistModel.getAllArtists();
      res.json(artists);
    } catch (error) {
      console.error('Error retrieving artists:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
  // Get an artist by ID
  exports.getArtistById = async (req, res) => {
    const { id } = req.params;
    try {
      const artist = await artistModel.getArtistById(id);
      if (!artist) {
        res.status(404).json({ error: 'Artist not found' });
      } else {
        res.json(artist);
      }
    } catch (error) {
      console.error('Error retrieving artist:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
  // Create a new artist
  exports.createArtist = async (req, res) => {
    const { name_original, short_name, slug, status } = req.body;
    try {
      const artist = await artistModel.createArtist(name_original, short_name, slug, status);
      res.json(artist);
    } catch (error) {
      console.error('Error creating artist:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
  // Update an artist by ID
  exports.updateArtist = async (req, res) => {
    const { id } = req.params;
    const { name_original, short_name, slug, status } = req.body;
    try {
      const artist = await artistModel.updateArtist(id, name_original, short_name, slug, status);
      if (!artist) {
        res.status(404).json({ error: 'Artist not found' });
      } else {
        res.json(artist);
      }
    } catch (error) {
      console.error('Error updating artist:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
  // Delete an artist by ID
  exports.deleteArtist = async (req, res) => {
    const { id } = req.params;
    try {
      const artist = await artistModel.deleteArtist(id);
      if (!artist) {
        res.status(404).json({ error: 'Artist not found' });
      } else {
        res.json({ message: 'Artist deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting artist:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = exports;
