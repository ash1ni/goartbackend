const { pool } = require('../config/dbConfig');

// Get all multimedia items
const getAllMultimedia = async () => {
  try {
    const query = 'SELECT * FROM multimedia';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Get a specific multimedia item by ID
const getMultimediaById = async (id) => {
  try {
    const query = 'SELECT * FROM multimedia WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Create a new multimedia item
const createMultimedia = async (multimediaData) => {
  try {
    const {
      title,
      subtitle,
      content,
      slug,
      content_type,
      position,
      status,
    } = multimediaData;
    const query = `INSERT INTO multimedia (title, subtitle, content, slug, content_type, position, status) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) 
                   RETURNING *`;
    const values = [
      title,
      subtitle,
      content,
      slug,
      content_type,
      position,
      status,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Update an existing multimedia item
const updateMultimedia = async (id, multimediaData) => {
  try {
    const {
      title,
      subtitle,
      content,
      slug,
      content_type,
      position,
      status,
    } = multimediaData;
    const query = `UPDATE multimedia SET title = $1, subtitle = $2, content = $3, slug = $4, 
                   content_type = $5, position = $6, status = $7, updated_at = NOW() 
                   WHERE id = $8 
                   RETURNING *`;
    const values = [
      title,
      subtitle,
      content,
      slug,
      content_type,
      position,
      status,
      id,
    ];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Delete a multimedia item
const deleteMultimedia = async (id) => {
  try {
    const query = 'DELETE FROM multimedia WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllMultimedia,
  getMultimediaById,
  createMultimedia,
  updateMultimedia,
  deleteMultimedia,
};
