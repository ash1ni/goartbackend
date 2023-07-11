const { readFile, readFileSync, readdirSync, readdir } = require("fs");
const { Readable } = require("stream");
const express = require("express");
const { execSync } = require("node:child_process");
const cors = require("cors");
require('dotenv').config();
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcrypt');
const app = express();
const port = 3002;
const usersRoutes = require('./routes/users');
const userLogsRoutes = require('./routes/userLogs');
const { pool } = require('./config/dbConfig');
const pagesRoutes = require('./routes/pages');
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// // Create a connection pool to reuse database connections
// const pool = new Pool({
//   connectionString: "postgres://postgres:password@localhost:5432/postgres",
// });

app.use(cors(corsOptions)); // Use this after the variable declaration

app.use(express.json());

// Reading files from migration folder.
async function runDdlScripts() {
  const testFolder = "./ddl-scripts/";
  const stdout = execSync(`bash main.sh`, { encoding: "utf-8" });
}

runDdlScripts();

app.get("/", async (req, res) => {
  res.send("hello");

  // res.send(result);
});

const sessionOptions = {
  store: new pgSession({
    // Configure the PostgreSQL connection details
    conString: "postgres://postgres:password@localhost/postgres",
    tableName: "session",
  }),
  secret: "$2b$10$jKiND5.3H8HkQY5S/HKeTuTqVL.8UTjOCKLmbYVu4VNaJo/mOy4zS", // Replace with your own session secret
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // Set the session duration (30 days in this example)
    secure: true, // Set to true if using HTTPS
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

app.use('/users', usersRoutes);

app.use('/user_logs', userLogsRoutes);

app.use('/pages', pagesRoutes);

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
    const query = `UPDATE exhibitions SET title = $1, subtitle = $2, content = $3, slug = $4, tags = $5, position = $6, status = $7, updated_at = current_timestamp WHERE id = $8 RETURNING *`;
    const values = [title, subtitle, content, slug, tags, position, status, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Exhibition not found." });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error updating exhibition:", error);
    res.status(500).json({
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
app.get("/events", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM events");
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// GET a specific event by ID
app.get("/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query("SELECT * FROM events WHERE id = $1", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error retrieving event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// POST a new event
app.post("/events", async (req, res) => {
  const { title, subtitle, content, slug, tags, position, status } = req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO events (title, subtitle, content, slug, tags, position, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, subtitle, content, slug, tags, position, status]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// PUT (update) an existing event
app.put("/events/:id", async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, content, slug, tags, position, status } = req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE events SET title = $1, subtitle = $2, content = $3, slug = $4, tags = $5, position = $6, status = $7, updated_at = NOW() WHERE id = $8 RETURNING *",
      [title, subtitle, content, slug, tags, position, status, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// GET all multimedia items
app.get("/multimedia", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM multimedia");
    const multimedia = result.rows;
    res.json(multimedia);
    client.release();
  } catch (error) {
    console.error("Error retrieving multimedia:", error);
    res.status(500).send("An error occurred while retrieving multimedia");
  }
});
// GET a specific multimedia item by ID
app.get("/multimedia/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM multimedia WHERE id = $1",
      [id]
    );
    const multimedia = result.rows[0];
    if (multimedia) {
      res.json(multimedia);
    } else {
      res.status(404).send(`Multimedia item with ID ${id} not found`);
    }
    client.release();
  } catch (error) {
    console.error(`Error retrieving multimedia item with ID ${id}:`, error);
    res
      .status(500)
      .send("An error occurred while retrieving the multimedia item");
  }
});
// POST a new multimedia item
app.post("/multimedia", async (req, res) => {
  const { title, subtitle, content, slug, content_type, position, status } =
    req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO multimedia (title, subtitle, content, slug, content_type, position, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, subtitle, content, slug, content_type, position, status]
    );
    const newMultimedia = result.rows[0];
    res.json(newMultimedia);
    client.release();
  } catch (error) {
    console.error("Error creating multimedia item:", error);
    res
      .status(500)
      .send("An error occurred while creating the multimedia item");
  }
});
// PUT/UPDATE a multimedia item by ID
app.put("/multimedia/:id", async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, content, slug, content_type, position, status } =
    req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE multimedia SET title = $1, subtitle = $2, content = $3, slug = $4, content_type = $5, position = $6, status = $7, updated_at = NOW() WHERE id = $8 RETURNING *",
      [title, subtitle, content, slug, content_type, position, status, id]
    );
    const updatedMultimedia = result.rows[0];
    if (updatedMultimedia) {
      res.json(updatedMultimedia);
    } else {
      res.status(404).send(`Multimedia item with ID ${id} not found`);
    }
    client.release();
  } catch (error) {
    console.error(`Error updating multimedia item with ID ${id}:`, error);
    res
      .status(500)
      .send("An error occurred while updating the multimedia item");
  }
});
// DELETE a multimedia item by ID
app.delete("/multimedia/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM multimedia WHERE id = $1 RETURNING *",
      [id]
    );
    const deletedMultimedia = result.rows[0];
    if (deletedMultimedia) {
      res.json(deletedMultimedia);
    } else {
      res.status(404).send(`Multimedia item with ID ${id} not found`);
    }
    client.release();
  } catch (error) {
    console.error(`Error deleting multimedia item with ID ${id}:`, error);
    res
      .status(500)
      .send("An error occurred while deleting the multimedia item");
  }
});

// Get all pick_artworks
app.get("/pick_artworks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pick_artworks");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching pick_artworks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Get a pick_artwork by ID
app.get("/pick_artworks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM pick_artworks WHERE id = $1",
      [id]
    );
    const pick_artwork = result.rows[0];
    if (pick_artwork) {
      res.json(pick_artwork);
    } else {
      res.status(404).send(`Pick_artwork with ID ${id} not found`);
    }
  } catch (error) {
    console.error(`Error fetching pick_artwork with ID ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new pick_artwork
app.post("/pick_artworks", async (req, res) => {
  const { artwork_id, position, status } = req.body;

  // Validate request body
  if (!artwork_id || !position || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO pick_artworks (artwork_id, position, status) VALUES ($1, $2, $3) RETURNING *",
      [artwork_id, position, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating pick_artwork:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a pick_artwork
app.put("/pick_artworks/:id", async (req, res) => {
  const { id } = req.params;
  const { artwork_id, position, status } = req.body;

  // Validate request body
  if (!artwork_id || !position || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "UPDATE pick_artworks SET artwork_id = $1, position = $2, status = $3 WHERE id = $4 RETURNING *",
      [artwork_id, position, status, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pick artwork not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating pick_artwork:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a pick_artwork
app.delete("/pick_artworks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM pick_artworks WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pick artwork not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting pick_artwork:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all spotlight_artworks
app.get("/spotlight_artworks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM spotlight_artworks");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting spotlight_artworks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get spotlight_artwork by id
app.get("/spotlight_artworks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM spotlight_artworks WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Spotlight artwork not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting spotlight_artwork:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new spotlight artwork
app.post("/spotlight_artworks", async (req, res) => {
  const { artwork_id, position, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO spotlight_artworks (artwork_id, position, status) VALUES ($1, $2, $3) RETURNING *",
      [artwork_id, position, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an existing spotlight artwork
app.put("/spotlight_artworks/:id", async (req, res) => {
  const id = req.params.id;
  const { artwork_id, position, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE spotlight_artworks SET artwork_id = $1, position = $2, status = $3 WHERE id = $4 RETURNING *",
      [artwork_id, position, status, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Spotlight artwork not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a spotlight artwork
app.delete("/spotlight_artworks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM spotlight_artworks WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Spotlight artwork not found" });
    } else {
      res.json({ message: "Spotlight artwork deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all event artworks
app.get("/event_artworks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM event_artworks");
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get an event artwork
app.get("/event_artworks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "SELECT * FROM event_artworks WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Event artwork not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new event artwork
app.post("/event_artworks", async (req, res) => {
  const { event_id, position, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO event_artworks (event_id, position, status) VALUES ($1, $2, $3) RETURNING *",
      [event_id, position, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Update an event artwork

app.put("/event_artworks/:id", async (req, res) => {
  const id = req.params.id;
  const { event_id, position, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE event_artworks SET event_id = $1, position = $2, status = $3 WHERE id = $4 RETURNING *",
      [event_id, position, status, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Event artwork not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete an event artwork
app.delete("/event_artworks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM event_artworks WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Event artwork not found" });
    } else {
      res.json({ message: "Event artwork deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch all media
app.get("/media", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM media");
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch a specific media file by ID
app.get("/media/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM media WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Media file not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Store the file path in the database
app.post("/media", async (req, res) => {
  if (!req.body.file || !req.body.filename) {
    res.status(400).json({ error: "Missing file or filename" });
    return;
  }

  const { file, filename } = req.body;

  // Create a Readable stream from the base64 file data
  const fileStream = Readable.from(file, "base64");

  // Generate a hash code for unique file names
  const hash = crypto.createHash("sha1");
  hash.update(file);
  const hashValue = hash.digest("hex");

  // Generate a unique filename based on the hash code and original filename
  const uniqueFilename = hashValue + "-" + filename;

  try {
    // Get current timestamp
    const now = new Date();

    // Write the file to disk in the 'uploads' directory
    const filePath = path.join(__dirname, "uploads", uniqueFilename);
    const writeStream = fs.createWriteStream(filePath);
    fileStream.pipe(writeStream);

    writeStream.on("finish", async () => {
      // Store the file path in the database
      const result = await pool.query(
        "INSERT INTO media (name, path, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $4) RETURNING *",
        [filename, filePath, true, now]
      );
      res.status(201).json(result.rows[0]);
    });
  } catch (error) {
    console.error("Error writing file", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a media entry
app.put("/api/media/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Check if the media entry exists
    const media = await pool.query("SELECT * FROM media WHERE id = $1", [id]);
    if (media.rows.length === 0) {
      res.status(404).json({ error: "Media entry not found" });
      return;
    }

    // Update the name of the media entry
    const updatedMedia = await pool.query(
      "UPDATE media SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );

    res.json(updatedMedia.rows[0]);
  } catch (error) {
    console.error("Error updating media", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a media file by ID
app.delete("/media/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM media WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Media file not found" });
    } else {
      const deletedFilePath = `uploads/${result.rows[0].path}`;
      fs.unlinkSync(deletedFilePath); // Delete the actual file from the server
      res.json({ message: "Media file deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve the media files in the frontend
app.use("/uploads", express.static("uploads"));

// Fetch all artist media entries
app.get("/artist-media", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM artist_media");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching artist media entries", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch artist media by ID
app.get("/artist-media/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM artist_media WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Artist media not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching artist media", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create an artist media entry
app.post("/artist-media", async (req, res) => {
  const { artist_id, media_id, position } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO artist_media (artist_id, media_id, position) VALUES ($1, $2, $3) RETURNING *",
      [artist_id, media_id, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating artist media entry", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an artist media entry
app.put("/artist-media/:id", async (req, res) => {
  const { id } = req.params;
  const { artist_id, media_id, position } = req.body;

  try {
    const result = await pool.query(
      "UPDATE artist_media SET artist_id = $1, media_id = $2, position = $3 WHERE id = $4 RETURNING *",
      [artist_id, media_id, position, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Artist media entry not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating artist media entry", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete an artist media entry
app.delete("/artist-media/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM artist_media WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Artist media entry not found" });
      return;
    }

    res.json({ message: "Artist media entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting artist media entry", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all collection_media records
app.get("/collection_media", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM collection_media");
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a specific collection_media record by ID
app.get("/collection_media/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM collection_media WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Collection media not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new collection_media record
app.post("/collection_media", async (req, res) => {
  const { position, collection_id, media_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO collection_media (position, collection_id, media_id) VALUES ($1, $2, $3) RETURNING *",
      [position, collection_id, media_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT to update a specific collection_media record by ID
app.put("/collection_media/:id", async (req, res) => {
  const { id } = req.params;
  const { position, collection_id, media_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE collection_media SET position = $1, collection_id = $2, media_id = $3 WHERE id = $4 RETURNING *",
      [position, collection_id, media_id, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Collection media not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a collection_media record by ID
app.delete("/collection_media/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM collection_media WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Collection media not found" });
    } else {
      res.json({ message: "Collection media deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all artwork_media records
app.get("/artwork_media", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM artwork_media");
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a specific artwork_media record by ID
app.get("/artwork_media/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM artwork_media WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Artwork media not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new artwork_media record
app.post("/artwork_media", async (req, res) => {
  const { artwork_id, media_id, position } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO artwork_media (artwork_id, media_id, position) VALUES ($1, $2, $3) RETURNING *",
      [artwork_id, media_id, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT to update a specific artwork_media record by ID
app.put("/artwork_media/:id", async (req, res) => {
  const { id } = req.params;
  const { artwork_id, media_id, position } = req.body;
  try {
    const result = await pool.query(
      "UPDATE artwork_media SET artwork_id = $1, media_id = $2, position = $3 WHERE id = $4 RETURNING *",
      [artwork_id, media_id, position, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Artwork media not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE an artwork_media record by ID
app.delete("/artwork_media/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM artwork_media WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Artwork media not found" });
    } else {
      res.json({ message: "Artwork media deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all exhibition_media records
app.get("/exhibition_media", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM exhibition_media");
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a specific exhibition_media record by ID
app.get("/exhibition_media/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM exhibition_media WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Exhibition media not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new exhibition_media record
app.post("/exhibition_media", async (req, res) => {
  const { exhibition_id, media_id, position } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO exhibition_media (exhibition_id, media_id, position) VALUES ($1, $2, $3) RETURNING *",
      [exhibition_id, media_id, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT to update a specific exhibition_media record by ID
app.put("/exhibition_media/:id", async (req, res) => {
  const { id } = req.params;
  const { exhibition_id, media_id, position } = req.body;
  try {
    const result = await pool.query(
      "UPDATE exhibition_media SET exhibition_id = $1, media_id = $2, position = $3 WHERE id = $4 RETURNING *",
      [exhibition_id, media_id, position, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Exhibition media not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE an exhibition_media record by ID
app.delete("/exhibition_media/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM exhibition_media WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Exhibition media not found" });
    } else {
      res.json({ message: "Exhibition media deleted successfully" });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// event-media routes
// Get all event_media records
app.get("/event_media", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM event_media");
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving event_media", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single event_media record by ID
app.get("/event_media/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM event_media WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Event media not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(`Error retrieving event_media with ID ${id}`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new event_media record
app.post("/event_media", async (req, res) => {
  const { event_id, media_id, position } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO event_media (event_id, media_id, position) VALUES ($1, $2, $3) RETURNING *",
      [event_id, media_id, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating event_media", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an event_media record
app.put("/event_media/:id", async (req, res) => {
  const id = req.params.id;
  const { event_id, media_id, position } = req.body;

  try {
    const result = await pool.query(
      "UPDATE event_media SET event_id = $1, media_id = $2, position = $3 WHERE id = $4 RETURNING *",
      [event_id, media_id, position, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Event media not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(`Error updating event_media with ID ${id}`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete an event_media record
app.delete("/event_media/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM event_media WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Event media not found" });
    } else {
      res.json({ message: "Event media deleted successfully" });
    }
  } catch (error) {
    console.error(`Error deleting event_media with ID ${id}`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});