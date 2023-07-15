// userModel.js
const { pool } = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);

const User = {
  async createUser(id,username, password, email, firstName, lastName, userRole, status) {
    const saltRounds = 10;
    try {
      // Hash the password using bcrypt
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      });

      const query =
        'INSERT INTO users (id, username, password, email, first_name, last_name, user_role, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
      const values = [id, username, hashedPassword, email, firstName, lastName, userRole, status];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async getUserById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  async getUserByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
  async getAllUsers() {
    const query = 'SELECT * FROM users';
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(error);
    }
  },

  // async getUserById(id) {
  //   const query = 'SELECT * FROM users WHERE id = $1';
  //   const values = [id];
  //   try {
  //     const result = await pool.query(query, values);
  //     return result.rows[0];
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // },

  async updateUserCredentials(id, username, password, email) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query =
      'UPDATE users SET username = $2, password = $3, email = $4 WHERE id = $1 RETURNING *';
    const values = [id, username, hashedPassword, email];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
};


module.exports = User;