// userModel.js
const { pool } = require('../config/dbConfig');

exports.create = async (user) => {
  const query = `INSERT INTO users
    (username, password, email, first_name, last_name, user_role, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`;

  const values = [
    user.username,
    user.password,
    user.email,
    user.first_name,
    user.last_name,
    user.user_role,
    user.status,
  ];

  const client = await pool.connect();
  const result = await client.query(query, values);
  client.release();

  return result.rows[0];
};

exports.findByUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const values = [username];

  const client = await pool.connect();
  const result = await client.query(query, values);
  client.release();

  return result.rows[0];
};
