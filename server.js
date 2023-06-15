const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3002;

// Create a connection pool to reuse database connections
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'goartwebsite',
  password: 'ash1ni',
  port: 5432,
});

app.use(express.json());
app.get("/", (req,res)=>{
    res.send("hello");
})

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      first_name,
      last_name,
      role,
      status,
    } = req.body;

    const query = `INSERT INTO users
      (username, password, email, first_name, last_name, role, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;

    const values = [
      username,
      password,
      email,
      first_name,
      last_name,
      role,
      status,
    ];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});

// Get a specific user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      password,
      email,
      first_name,
      last_name,
      role,
      status,
    } = req.body;

    const query = `UPDATE users
      SET username = $1, password = $2, email = $3, first_name = $4, last_name = $5, role = $6, status = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *`;

    const values = [
      username,
      password,
      email,
      first_name,
      last_name,
      role,
      status,
      id,
    ];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found'
    },
    res.json(result.rows[0]))};
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM users WHERE id = $1';
    const values = [id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// Create a new user log
app.post('/user_logs', async (req, res) => {
  try {
    const { user_id, module, action, details } = req.body;

    const query = `INSERT INTO user_logs
      (user_id, module, action, details)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;

    const values = [user_id, module, action, details];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all user logs
app.get('/user_logs', async (req, res) => {
  try {
    const query = 'SELECT * FROM user_logs';
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific user log by ID
app.get('/user_logs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM user_logs WHERE id = $1';
    const values = [id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User log not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
