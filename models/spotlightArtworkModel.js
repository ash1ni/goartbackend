const { pool } = require('../config/dbConfig');

const spotlightArtworkModel = {
  getAllSpotlightArtworks: async () => {
    try {
      const query = 'SELECT * FROM spotlight_artworks';
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error('Error retrieving spotlight artworks from the database');
    }
  },

  getSpotlightArtworkById: async (id) => {
    try {
      const query = 'SELECT * FROM spotlight_artworks WHERE id = $1';
      const values = [id];
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        throw new Error('Spotlight artwork not found');
      }

      return rows[0];
    } catch (error) {
      throw new Error(`Error retrieving spotlight artwork with ID ${id}`);
    }
  },

  createSpotlightArtwork: async (spotlightArtworkData) => {
    try {
      const {
        artwork_id,
        position,
        status,
      } = spotlightArtworkData;

      const query = 'INSERT INTO spotlight_artworks (artwork_id, position, status) VALUES ($1, $2, $3) RETURNING *';
      const values = [artwork_id, position, status];
      const { rows } = await pool.query(query, values);

      return rows[0];
    } catch (error) {
      throw new Error('Error creating spotlight artwork');
    }
  },

  updateSpotlightArtwork: async (id, spotlightArtworkData) => {
    try {
      const {
        artwork_id,
        position,
        status,
      } = spotlightArtworkData;

      const query = 'UPDATE spotlight_artworks SET artwork_id = $1, position = $2, status = $3 WHERE id = $4 RETURNING *';
      const values = [artwork_id, position, status, id];
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        throw new Error('Spotlight artwork not found');
      }

      return rows[0];
    } catch (error) {
      throw new Error(`Error updating spotlight artwork with ID ${id}`);
    }
  },

  deleteSpotlightArtwork: async (id) => {
    try {
      const query = 'DELETE FROM spotlight_artworks WHERE id = $1 RETURNING *';
      const values = [id];
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        throw new Error('Spotlight artwork not found');
      }

      return rows[0];
    } catch (error) {
      throw new Error(`Error deleting spotlight artwork with ID ${id}`);
    }
  },
};

module.exports = spotlightArtworkModel;
