const { pool } = require('../config/dbConfig');

class Exhibition {
  static async createExhibition(exhibitionData) {
    const { title, subtitle, content, slug, tags, position, status } = exhibitionData;
    const query =
      'INSERT INTO exhibitions (title, subtitle, content, slug, tags, position, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [title, subtitle, content, slug, tags, position, status];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error creating exhibition');
    }
  }

  static async getAllExhibitions() {
    try {
      const query = 'SELECT * FROM exhibitions';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error getting exhibitions');
    }
  }

  static async getExhibitionById(id) {
    try {
      const query = 'SELECT * FROM exhibitions WHERE id = $1';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error('Exhibition not found');
      }
      return result.rows[0];
    } catch (error) {
      throw new Error('Error getting exhibition by ID');
    }
  }

  static async updateExhibition(id, exhibitionData) {
    const { title, subtitle, content, slug, tags, position, status } = exhibitionData;
    const query =
      'UPDATE exhibitions SET title = $1, subtitle = $2, content = $3, slug = $4, tags = $5, position = $6, status = $7, updated_at = current_timestamp WHERE id = $8 RETURNING *';
    const values = [title, subtitle, content, slug, tags, position, status, id];

    try {
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('Exhibition not found');
      }
      return result.rows[0];
    } catch (error) {
      throw new Error('Error updating exhibition');
    }
  }

  static async deleteExhibition(id) {
    try {
      const query = 'DELETE FROM exhibitions WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error('Exhibition not found');
      }
    } catch (error) {
      throw new Error('Error deleting exhibition');
    }
  }
}

module.exports = Exhibition;
