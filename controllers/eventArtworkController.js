const EventArtwork = require('../models/eventArtworkModel');

class EventArtworkController {
  static async getAllEventArtworks(req, res) {
    try {
      const eventArtworks = await EventArtwork.getAllEventArtworks();
      res.json(eventArtworks);
    } catch (error) {
      console.error('Error retrieving event artworks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEventArtworkById(req, res) {
    const { id } = req.params;

    try {
      const eventArtwork = await EventArtwork.getEventArtworkById(id);
      res.json(eventArtwork);
    } catch (error) {
      console.error('Error retrieving event artwork:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createEventArtwork(req, res) {
    const { event_id, position, status } = req.body;

    try {
      const eventArtwork = await EventArtwork.createEventArtwork(
        event_id,
        position,
        status
      );
      res.status(201).json(eventArtwork);
    } catch (error) {
      console.error('Error creating event artwork:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateEventArtwork(req, res) {
    const { id } = req.params;
    const { event_id, position, status } = req.body;

    try {
      const eventArtwork = await EventArtwork.updateEventArtwork(
        id,
        event_id,
        position,
        status
      );
      res.json(eventArtwork);
    } catch (error) {
      console.error('Error updating event artwork:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteEventArtwork(req, res) {
    const { id } = req.params;

    try {
      const result = await EventArtwork.deleteEventArtwork(id);
      res.json(result);
    } catch (error) {
      console.error('Error deleting event artwork:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = EventArtworkController;
