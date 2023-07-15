const { pool } = require('../config/dbConfig');

const ArtworkMedia = {
  async create(artworkId, mediaId, position) {
    const query =
      'INSERT INTO artwork_media (artwork_id, media_id, position) VALUES ($1, $2, $3) RETURNING *';
    const values = [artworkId, mediaId, position];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async getAll() {
    const query = 'SELECT * FROM artwork_media';

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(error);
    }
  },

  async getById(id) {
    const query = 'SELECT * FROM artwork_media WHERE id = $1';
    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async update(id, artworkId, mediaId, position) {
    const query =
      'UPDATE artwork_media SET artwork_id = $2, media_id = $3, position = $4 WHERE id = $1 RETURNING *';
    const values = [id, artworkId, mediaId, position];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async delete(id) {
    const query = 'DELETE FROM artwork_media WHERE id = $1';
    const values = [id];

    try {
      await pool.query(query, values);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = ArtworkMedia;
