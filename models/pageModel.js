const { pool } = require('../config/dbConfig');
// Create a new page
exports.create = async (page) => {
    const {
      slug,
      title,
      description,
      content,
      tags,
      meta,
      show_in_menu,
      status,
    } = page;
  
    const query = `INSERT INTO pages
      (slug, title, description, content, tags, meta, show_in_menu, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`;
  
    const values = [
      slug,
      title,
      description,
      content,
      tags,
      meta,
      show_in_menu,
      status,
    ];
  
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
  
    return result.rows[0];
  };
  
  // Get all pages
  exports.getAll = async () => {
    const query = 'SELECT * FROM pages';
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
  
    return result.rows;
  };
  
  // Get a specific page by ID
  exports.getById = async (id) => {
    const query = 'SELECT * FROM pages WHERE id = $1';
    const values = [id];
  
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
  
    return result.rows[0];
  };
  
  // Update a page by ID
  exports.updateById = async (id, page) => {
    const {
      slug,
      title,
      description,
      content,
      tags,
      meta,
      show_in_menu,
      status,
    } = page;
  
    const query = `UPDATE pages
      SET slug = $1, title = $2, description = $3, content = $4, tags = $5, meta = $6, show_in_menu = $7, status = $8, updated_at = NOW()
      WHERE id = $9
      RETURNING *`;
  
    const values = [
      slug,
      title,
      description,
      content,
      tags,
      meta,
      show_in_menu,
      status,
      id,
    ];
  
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
  
    return result.rows[0];
  };
  
  // Delete a page by ID
  exports.deleteById = async (id) => {
    const query = 'DELETE FROM pages WHERE id = $1';
    const values = [id];
  
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
  
    return result.rowCount > 0;
};
  
module.exports = exports;
