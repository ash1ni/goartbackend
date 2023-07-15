const ArtworkMedia = require('../models/artworkMediaModel');

const ArtworkMediaController = {
  async create(req, res) {
    try {
      const { artworkId, mediaId, position } = req.body;

      const artworkMedia = await ArtworkMedia.create(artworkId, mediaId, position);

      res.status(201).json({ success: true, artworkMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getAll(req, res) {
    try {
      const artworkMedia = await ArtworkMedia.getAll();
      res.status(200).json({ success: true, artworkMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const artworkMedia = await ArtworkMedia.getById(id);
      if (!artworkMedia) {
        return res.status(404).json({ success: false, error: 'Artwork Media not found' });
      }
      res.status(200).json({ success: true, artworkMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { artworkId, mediaId, position } = req.body;

      const existingArtworkMedia = await ArtworkMedia.getById(id);
      if (!existingArtworkMedia) {
        return res.status(404).json({ success: false, error: 'Artwork Media not found' });
      }

      const updatedArtworkMedia = await ArtworkMedia.update(id, artworkId, mediaId, position);

      res.status(200).json({ success: true, artworkMedia: updatedArtworkMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existingArtworkMedia = await ArtworkMedia.getById(id);
      if (!existingArtworkMedia) {
        return res.status(404).json({ success: false, error: 'Artwork Media not found' });
      }

      await ArtworkMedia.delete(id);

      res.status(200).json({ success: true, message: 'Artwork Media deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },
};

module.exports = ArtworkMediaController;
