const { pool } = require('../config/dbConfig');

// Get all pick artworks
const getAllPickArtworks = async () => {
  try {
    const query = 'SELECT * FROM pick_artworks';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw new Error('Error retrieving pick artworks');
  }
};

// Get a pick artwork by ID
const getPickArtworkById = async (id) => {
  try {
    const query = 'SELECT * FROM pick_artworks WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    throw new Error('Error retrieving pick artwork');
  }
};

// Create a new pick artwork
const createPickArtwork = async (artworkId, position, status) => {
  try {
    const query =
      'INSERT INTO pick_artworks (artwork_id, position, status) VALUES ($1, $2, $3) RETURNING *';
    const values = [artworkId, position, status];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw new Error('Error creating pick artwork');
  }
};

// Update a pick artwork by ID
const updatePickArtwork = async (id, artworkId, position, status) => {
  try {
    const query =
      'UPDATE pick_artworks SET artwork_id = $1, position = $2, status = $3 WHERE id = $4 RETURNING *';
    const values = [artworkId, position, status, id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    throw new Error('Error updating pick artwork');
  }
};

// Delete a pick artwork by ID
const deletePickArtwork = async (id) => {
  try {
    const query = 'DELETE FROM pick_artworks WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    throw new Error('Error deleting pick artwork');
  }
};

module.exports = {
  getAllPickArtworks,
  getPickArtworkById,
  createPickArtwork,
  updatePickArtwork,
  deletePickArtwork,
};
