const { pool } = require('../config/dbConfig');

class EventArtwork {
  static async getAllEventArtworks() {
    try {
      const query = 'SELECT * FROM event_artworks';
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error('Error retrieving event artworks');
    }
  }

  static async getEventArtworkById(id) {
    try {
      const query = 'SELECT * FROM event_artworks WHERE id = $1';
      const { rows } = await pool.query(query, [id]);
      if (rows.length === 0) {
        throw new Error('Event artwork not found');
      }
      return rows[0];
    } catch (error) {
      throw new Error('Error retrieving event artwork');
    }
  }

  static async createEventArtwork(eventId, position, status) {
    try {
      const query =
        'INSERT INTO event_artworks (event_id, position, status) VALUES ($1, $2, $3) RETURNING *';
      const { rows } = await pool.query(query, [eventId, position, status]);
      return rows[0];
    } catch (error) {
      throw new Error('Error creating event artwork');
    }
  }

  static async updateEventArtwork(id, eventId, position, status) {
    try {
      const query =
        'UPDATE event_artworks SET event_id = $1, position = $2, status = $3 WHERE id = $4 RETURNING *';
      const { rows } = await pool.query(query, [eventId, position, status, id]);
      if (rows.length === 0) {
        throw new Error('Event artwork not found');
      }
      return rows[0];
    } catch (error) {
      throw new Error('Error updating event artwork');
    }
  }

  static async deleteEventArtwork(id) {
    try {
      const query = 'DELETE FROM event_artworks WHERE id = $1 RETURNING *';
      const { rows } = await pool.query(query, [id]);
      if (rows.length === 0) {
        throw new Error('Event artwork not found');
      }
      return { message: 'Event artwork deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting event artwork');
    }
  }
}

module.exports = EventArtwork;
