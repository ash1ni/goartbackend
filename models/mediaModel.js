const { pool } = require('../config/dbConfig');
const cloudinary = require('../config/cloudinaryConfig');

const Media = {
  async create(name, path, status) {
    const query =
      'INSERT INTO media (name, path, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, path, status, new Date(), new Date()];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async getAll() {
    const query = 'SELECT * FROM media';

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(error);
    }
  },

  async getById(id) {
    const query = 'SELECT * FROM media WHERE id = $1';
    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async update(id, name, path, status) {
    const query =
      'UPDATE media SET name = $2, path = $3, status = $4, updated_at = $5 WHERE id = $1 RETURNING *';
    const values = [id, name, path, status, new Date()];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async delete(id) {
    const query = 'DELETE FROM media WHERE id = $1';
    const values = [id];

    try {
      await pool.query(query, values);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = Media;
