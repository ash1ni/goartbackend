const ArtistMedia = require('../models/artistMediaModel');

const ArtistMediaController = {
  async create(req, res) {
    try {
      const { artistId, mediaId, position } = req.body;

      const artistMedia = await ArtistMedia.create(artistId, mediaId, position);

      res.status(201).json({ success: true, artistMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getAll(req, res) {
    try {
      const artistMedia = await ArtistMedia.getAll();
      res.status(200).json({ success: true, artistMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const artistMedia = await ArtistMedia.getById(id);
      if (!artistMedia) {
        return res.status(404).json({ success: false, error: 'Artist Media not found' });
      }
      res.status(200).json({ success: true, artistMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { artistId, mediaId, position } = req.body;

      const existingArtistMedia = await ArtistMedia.getById(id);
      if (!existingArtistMedia) {
        return res.status(404).json({ success: false, error: 'Artist Media not found' });
      }

      const updatedArtistMedia = await ArtistMedia.update(id, artistId, mediaId, position);

      res.status(200).json({ success: true, artistMedia: updatedArtistMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existingArtistMedia = await ArtistMedia.getById(id);
      if (!existingArtistMedia) {
        return res.status(404).json({ success: false, error: 'Artist Media not found' });
      }

      await ArtistMedia.delete(id);

      res.status(200).json({ success: true, message: 'Artist Media deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },
};

module.exports = ArtistMediaController;
