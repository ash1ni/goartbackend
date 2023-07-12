const { pool } = require('../config/dbConfig');

// Get all collections
exports.getAllCollections = async () => {
  const query = 'SELECT * FROM collections';
  const { rows } = await pool.query(query);
  return rows;
};

// Get a collection by ID
exports.getCollectionById = async (id) => {
  const query = 'SELECT * FROM collections WHERE id = $1';
  const values = [id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Create a new collection
exports.createCollection = async (name, status) => {
  const query =
    'INSERT INTO collections (name, status) VALUES ($1, $2) RETURNING *';
  const values = [name, status];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Update a collection
exports.updateCollection = async (id, name, status) => {
  const query =
    'UPDATE collections SET name = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *';
  const values = [name, status, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Delete a collection
exports.deleteCollection = async (id) => {
  const query = 'DELETE FROM collections WHERE id = $1 RETURNING *';
  const values = [id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};
