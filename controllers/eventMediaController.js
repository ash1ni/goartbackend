const EventMedia = require('../models/eventMediaModel');
const EventMediaController = {
  async create(req, res) {
    try {
      const { eventId, mediaId, position } = req.body;

      const eventMedia = await EventMedia.create(eventId, mediaId, position);

      res.status(201).json({ success: true, eventMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getAll(req, res) {
    try {
      const eventMedia = await EventMedia.getAll();
      res.status(200).json({ success: true, eventMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const eventMedia = await EventMedia.getById(id);
      if (!eventMedia) {
        return res.status(404).json({ success: false, error: 'Event Media not found' });
      }
      res.status(200).json({ success: true, eventMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { eventId, mediaId, position } = req.body;

      const existingEventMedia = await EventMedia.getById(id);
      if (!existingEventMedia) {
        return res.status(404).json({ success: false, error: 'Event Media not found' });
      }

      const updatedEventMedia = await EventMedia.update(id, eventId, mediaId, position);

      res.status(200).json({ success: true, eventMedia: updatedEventMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existingEventMedia = await EventMedia.getById(id);
      if (!existingEventMedia) {
        return res.status(404).json({ success: false, error: 'Event Media not found' });
      }

      await EventMedia.delete(id);

      res.status(200).json({ success: true, message: 'Event Media deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },
};

module.exports = EventMediaController;
