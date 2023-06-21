const { readFile, readFileSync, readdirSync, readdir } = require("node:fs");
const express = require("express");
const { Pool } = require("pg");
const { execSync } = require("node:child_process");
//const fs = require('fs')

const app = express();
const port = 3002;

// Create a connection pool to reuse database connections
const pool = new Pool({
  connectionString: "postgres://postgres:password@localhost:5432/postgres",
});

app.use(express.json());
// Reading files from migration folder.
async function runDdlScripts() {
  // const data = readFileSync('./ddl-scripts/create_users_table.sql', 'utf-8' )
  // const result = await pool.query(data)
  // await pool.end();
  // console.log(result);
  const testFolder = "./ddl-scripts/";
  // const rootPath = execSync('echo %cd%')
  readdir(testFolder, (err, files) => {
    files.forEach((element) => {
      const stdout = execSync(
        `psql -h localhost -U postgres -d postgres -a -f ${testFolder}\\${element}`,
        { encoding: "utf-8" }
      );
      //console.log(stdout);
      //console.log(element)
    });
  });
  // const fileArray = []
  // files.forEach(file => {
  //     fileArray.push(file)
  //     })
  //     const result = await pool.query(data)
  //     console.log(result);
}

runDdlScripts();

app.get("/", async (req, res) => {
  res.send("hello");

  // res.send(result);
});

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const { username, password, email, first_name, last_name, role, status } =
      req.body;

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
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const query = "SELECT * FROM users";
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "SELECT * FROM users WHERE id = $1";
    const values = [id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email, first_name, last_name, role, status } =
      req.body;

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
      return res
        .status(404)
        .json({ error: "User not found" }, res.json(result.rows[0]));
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM users WHERE id = $1";
    const values = [id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// Create a new user log
app.post("/user_logs", async (req, res) => {
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
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all user logs
app.get("/user_logs", async (req, res) => {
  try {
    const query = "SELECT * FROM user_logs";
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific user log by ID
app.get("/user_logs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "SELECT * FROM user_logs WHERE id = $1";
    const values = [id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User log not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Create a new page
app.post("/pages", async (req, res) => {
  try {
    const {
      slug,
      title,
      description,
      content,
      tags,
      meta,
      show_in_menu,
      status,
    } = req.body;

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

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all pages
app.get("/pages", async (req, res) => {
  try {
    const query = "SELECT * FROM pages";
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific page by ID
app.get("/pages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "SELECT * FROM pages WHERE id = $1";
    const values = [id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Page not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Update a page by ID
app.put("/pages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      slug,
      title,
      description,
      content,
      tags,
      meta,
      show_in_menu,
      status,
    } = req.body;

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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Page not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Delete a page by ID
app.delete("/pages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM pages WHERE id = $1";
    const values = [id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Page not found" });
    }

    res.json({ message: "Page deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Create a new menu item
app.post("/menu", async (req, res) => {
  try {
    const { page_id, position } = req.body;

    const query = `INSERT INTO menu (page_id, position) VALUES ($1, $2) RETURNING *`;
    const values = [page_id, position];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get all menu items
app.get("/menu", async (req, res) => {
  try {
    const query = "SELECT * FROM menu";
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get a specific menu item by ID
app.get("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "SELECT * FROM menu WHERE id = $1";
    const values = [id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Update a menu item by ID
app.put("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { page_id, position } = req.body;

    const query =
      "UPDATE menu SET page_id = $1, position = $2 WHERE id = $3 RETURNING *";
    const values = [page_id, position, id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a menu item by ID
app.delete("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM menu WHERE id = $1";
    const values = [id];

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// GET all artists
app.get("/artists", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM artists");
    res.json(rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// GET an artist by ID
app.get("/artists/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM artists WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Artist not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// CREATE a new artist
app.post("/artists", async (req, res) => {
  const { name_original, short_name, slug, status } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO artists (name_original, short_name, slug, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [name_original, short_name, slug, status]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// UPDATE an artist
app.put("/artists/:id", async (req, res) => {
  const { id } = req.params;
  const { name_original, short_name, slug, status } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE artists SET name_original = $1, short_name = $2, slug = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *",
      [name_original, short_name, slug, status, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Artist not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// DELETE an artist
app.delete("/artists/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM artists WHERE id = $1 RETURNING *",
      [id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Artist not found" });
    } else {
      res.json({ message: "Artist deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
// GET all collections
app.get("/collections", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM collections");
    res.json(rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
// GET a collection by ID
app.get("/collections/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM collections WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Collection not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
// CREATE a new collection
app.post("/collections", async (req, res) => {
  const { name, status } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO collections (name, status) VALUES ($1, $2) RETURNING *",
      [name, status]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
// UPDATE a collection
app.put("/collections/:id", async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE collections SET name = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [name, status, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Collection not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
// DELETE a collection
app.delete("/collections/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM collections WHERE id = $1 RETURNING *",
      [id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Collection not found" });
    } else {
      res.json({ message: "Collection deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
// Routes
app.get("/artwork", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM artwork");
    res.json(rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/artwork", async (req, res) => {
  const {
    collection_id,
    name,
    slug,
    title,
    description,
    content,
    tags,
    meta,
    status,
  } = req.body;
  const createdAt = new Date();
  const updatedAt = createdAt;

  try {
    const { rows } = await pool.query(
      `INSERT INTO artwork (collection_id, name, slug, title, description, content, tags, meta, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        collection_id,
        name,
        slug,
        title,
        description,
        content,
        tags,
        meta,
        status,
        createdAt,
        updatedAt,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/artwork/:id", async (req, res) => {
  const artworkId = req.params.id;

  try {
    const { rows } = await pool.query("SELECT * FROM artwork WHERE id = $1", [
      artworkId,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Artwork not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/artwork/:id", async (req, res) => {
  const artworkId = req.params.id;
  const {
    collection_id,
    name,
    slug,
    title,
    description,
    content,
    tags,
    meta,
    status,
  } = req.body;
  const updatedAt = new Date();

  try {
    const { rows } = await pool.query(
      `UPDATE artwork SET
       collection_id = $1, name = $2, slug = $3, title = $4, description = $5,
       content = $6, tags = $7, meta = $8, status = $9, updated_at = $10
       WHERE id = $11
       RETURNING *`,
      [
        collection_id,
        name,
        slug,
        title,
        description,
        content,
        tags,
        meta,
        status,
        updatedAt,
        artworkId,
      ]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "Artwork not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/artwork/:id", async (req, res) => {
  const artworkId = req.params.id;

  try {
    const { rows } = await pool.query(
      "DELETE FROM artwork WHERE id = $1 RETURNING *",
      [artworkId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "Artwork not found" });
    } else {
      res.json({ message: "Artwork deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Exhibitions routes

// Create an exhibition
app.post("/exhibitions", async (req, res) => {
  try {
    const { title, subtitle, content, slug, tags, position, status } = req.body;
    const query =
      "INSERT INTO exhibitions (title, subtitle, content, slug, tags, position, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const values = [title, subtitle, content, slug, tags, position, status];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating exhibition:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the exhibition." });
  }
});

// Get all exhibitions
app.get("/exhibitions", async (req, res) => {
  try {
    const query = `SELECT * FROM exhibitions`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting exhibitions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving exhibitions." });
  }
});

// Get a single exhibition
app.get("/exhibitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM exhibitions WHERE id = $1`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Exhibition not found." });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error getting exhibition:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the exhibition." });
  }
});
// Update an exhibition
app.put("/exhibitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, content, slug, tags, position, status } = req.body;
    const query =
      `UPDATE exhibitions SET title = $1, subtitle = $2, content = $3, slug = $4, tags = $5, position = $6, status = $7, updated_at = current_timestamp WHERE id = $8 RETURNING *`;
    const values = [title, subtitle, content, slug, tags, position, status, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Exhibition not found." });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error updating exhibition:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving exhibitions by id. ",
      });
  }
});
// Delete an exhibition
app.delete("/exhibitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM exhibitions WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Exhibition not found." });
    } else {
      res.json({ message: "Exhibition deleted successfully." });
    }
  } catch (error) {
    console.error("Error deleting exhibition:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the exhibition." });
  }
});


// GET all events
app.get('/events', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events');
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// GET a specific event by ID
app.get('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error retrieving event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// POST a new event
app.post('/events', async (req, res) => {
  const { title, subtitle, content, slug, tags, position, status } = req.body;

  try {
    const { rows } = await pool.query(
      'INSERT INTO events (title, subtitle, content, slug, tags, position, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, subtitle, content, slug, tags, position, status]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// PUT (update) an existing event
app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, content, slug, tags, position, status } = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE events SET title = $1, subtitle = $2, content = $3, slug = $4, tags = $5, position = $6, status = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
      [title, subtitle, content, slug, tags, position, status, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});