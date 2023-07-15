const ExhibitionMedia = require('../models/exhibitionMediaModel');

const ExhibitionMediaController = {
  async create(req, res) {
    try {
      const { exhibitionId, mediaId, position } = req.body;

      const exhibitionMedia = await ExhibitionMedia.create(exhibitionId, mediaId, position);

      res.status(201).json({ success: true, exhibitionMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getAll(req, res) {
    try {
      const exhibitionMedia = await ExhibitionMedia.getAll();
      res.status(200).json({ success: true, exhibitionMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const exhibitionMedia = await ExhibitionMedia.getById(id);
      if (!exhibitionMedia) {
        return res.status(404).json({ success: false, error: 'Exhibition Media not found' });
      }
      res.status(200).json({ success: true, exhibitionMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { exhibitionId, mediaId, position } = req.body;

      const existingExhibitionMedia = await ExhibitionMedia.getById(id);
      if (!existingExhibitionMedia) {
        return res.status(404).json({ success: false, error: 'Exhibition Media not found' });
      }

      const updatedExhibitionMedia = await ExhibitionMedia.update(
        id,
        exhibitionId,
        mediaId,
        position
      );

      res.status(200).json({ success: true, exhibitionMedia: updatedExhibitionMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existingExhibitionMedia = await ExhibitionMedia.getById(id);
      if (!existingExhibitionMedia) {
        return res.status(404).json({ success: false, error: 'Exhibition Media not found' });
      }

      await ExhibitionMedia.delete(id);

      res.status(200).json({ success: true, message: 'Exhibition Media deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },
};

module.exports = ExhibitionMediaController;
