const { pool } = require('../config/dbConfig');
// Create a new user log
const create = async (userLog) => {
    const { user_id, module, action, details } = userLog;
  
    const query = `INSERT INTO user_logs
      (user_id, module, action, details)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
  
    const values = [user_id, module, action, details];
  
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
  
    return result.rows[0];
  };
  
  // Get all user logs
  const getAll = async () => {
    const query = 'SELECT * FROM user_logs';
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
  
    return result.rows;
  };
  
  // Get a specific user log by ID
  const getById = async (id) => {
    const query = 'SELECT * FROM user_logs WHERE id = $1';
    const values = [id];
  
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
  
    return result.rows[0];
  };

module.exports = {
    create,
    getAll,
    getById
}