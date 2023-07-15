const CollectionMedia = require('../models/collectionMediaModel');

const CollectionMediaController = {
  async create(req, res) {
    try {
      const { position, collectionId, mediaId } = req.body;

      const collectionMedia = await CollectionMedia.create(position, collectionId, mediaId);

      res.status(201).json({ success: true, collectionMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getAll(req, res) {
    try {
      const collectionMedia = await CollectionMedia.getAll();
      res.status(200).json({ success: true, collectionMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const collectionMedia = await CollectionMedia.getById(id);
      if (!collectionMedia) {
        return res.status(404).json({ success: false, error: 'Collection Media not found' });
      }
      res.status(200).json({ success: true, collectionMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { position, collectionId, mediaId } = req.body;

      const existingCollectionMedia = await CollectionMedia.getById(id);
      if (!existingCollectionMedia) {
        return res.status(404).json({ success: false, error: 'Collection Media not found' });
      }

      const updatedCollectionMedia = await CollectionMedia.update(
        id,
        position,
        collectionId,
        mediaId
      );

      res.status(200).json({ success: true, collectionMedia: updatedCollectionMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existingCollectionMedia = await CollectionMedia.getById(id);
      if (!existingCollectionMedia) {
        return res.status(404).json({ success: false, error: 'Collection Media not found' });
      }

      await CollectionMedia.delete(id);

      res.status(200).json({ success: true, message: 'Collection Media deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },
};

module.exports = CollectionMediaController;
