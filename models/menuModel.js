const { pool } = require('../config/dbConfig');
// Create a new menu item
exports.create = async (page_id, position) => {
    const query = `INSERT INTO menu (page_id, position) VALUES ($1, $2) RETURNING *`;
    const values = [page_id, position];
  
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
  
    return result.rows[0];
  };
  
  // Get all menu items
  exports.getAll = async () => {
    const query = 'SELECT * FROM menu';
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
  
    return result.rows;
  };
  
  // Get a specific menu item by ID
  exports.getById = async (id) => {
    const query = 'SELECT * FROM menu WHERE id = $1';
    const values = [id];
  
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
  
    return result.rows[0];
  };
  
  // Update a menu item by ID
  exports.updateById = async (id, page_id, position) => {
    const query = 'UPDATE menu SET page_id = $1, position = $2 WHERE id = $3 RETURNING *';
    const values = [page_id, position, id];
  
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
  
    return result.rows[0];
  };
  
  // Delete a menu item by ID
  exports.deleteById = async (id) => {
    const query = 'DELETE FROM menu WHERE id = $1';
    const values = [id];
  
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
  
    return result.rowCount > 0;
};
module.exports = exports;
