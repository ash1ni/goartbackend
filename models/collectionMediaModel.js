const { pool } = require('../config/dbConfig');

const CollectionMedia = {
  async create(position, collectionId, mediaId) {
    const query =
      'INSERT INTO collection_media (position, collection_id, media_id) VALUES ($1, $2, $3) RETURNING *';
    const values = [position, collectionId, mediaId];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async getAll() {
    const query = 'SELECT * FROM collection_media';

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(error);
    }
  },

  async getById(id) {
    const query = 'SELECT * FROM collection_media WHERE id = $1';
    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async update(id, position, collectionId, mediaId) {
    const query =
      'UPDATE collection_media SET position = $2, collection_id = $3, media_id = $4 WHERE id = $1 RETURNING *';
    const values = [id, position, collectionId, mediaId];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async delete(id) {
    const query = 'DELETE FROM collection_media WHERE id = $1';
    const values = [id];

    try {
      await pool.query(query, values);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = CollectionMedia;
