const { pool } = require('../config/dbConfig');
// Get all artists
exports.getAllArtists = async () => {
    const query = 'SELECT * FROM artists';
    const { rows } = await pool.query(query);
    return rows;
  };
  
  // Get an artist by ID
  exports.getArtistById = async (id) => {
    const query = 'SELECT * FROM artists WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  };
  
  // Create a new artist
  exports.createArtist = async (name_original, short_name, slug, status) => {
    const query =
      'INSERT INTO artists (name_original, short_name, slug, status) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name_original, short_name, slug, status];
    const { rows } = await pool.query(query, values);
    return rows[0];
  };
  
  // Update an artist by ID
  exports.updateArtist = async (id, name_original, short_name, slug, status) => {
    const query =
      'UPDATE artists SET name_original = $1, short_name = $2, slug = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *';
    const values = [name_original, short_name, slug, status, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  };
  
  // Delete an artist by ID
  exports.deleteArtist = async (id) => {
    const query = 'DELETE FROM artists WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};
module.exports = exports;
