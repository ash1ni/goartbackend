const { readFile, readFileSync, readdirSync, readdir } = require("fs");
const { Readable } = require("stream");
const express = require("express");
const { execSync } = require("node:child_process");
const cors = require("cors");
require('dotenv').config();
const crypto = require("crypto");
// const fs = require("fs");
const path = require("path");
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.SERVER_PORT;

const { pool } = require('./config/dbConfig');
const usersRoutes = require('./routes/users');
const userLogsRoutes = require('./routes/userLogs');
const pagesRoutes = require('./routes/pages');
const menuRoutes = require('./routes/menu');
const artistRoutes = require('./routes/artist');
const collectionRoutes = require('./routes/collection');
const artworkRoutes = require('./routes/artwork');
const exhibitionRouter = require('./routes/exhibition');
const eventsRouter = require('./routes/events');
const multimediaRouter = require('./routes/multimedia');
const pickArtworkRouter = require('./routes/pickArtwork')
const spotlightArtworkRouter = require('./routes/spotlightArtwork');
const eventArtworkRouter = require('./routes/eventArtwork');
const mediaRoutes = require('./routes/media');
const artistMediaRoutes = require('./routes/artistMedia');
const collectionMediaRoutes = require('./routes/collectionMedia')

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

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
  secret: process.env.SESSION_SECRET, // Replace with your own session secret
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

app.use('/menu', menuRoutes);

app.use('/artists', artistRoutes);

app.use('/collections', collectionRoutes);

app.use('/artworks', artworkRoutes);

app.use('/exhibitions', exhibitionRouter);

app.use('/events', eventsRouter);

app.use('/multimedia', multimediaRouter);

app.use('/pick-artworks', pickArtworkRouter);

app.use('/spotlight-artworks', spotlightArtworkRouter);

app.use('/event-artworks', eventArtworkRouter);

app.use('/media', mediaRoutes);

app.use('/artist-media', artistMediaRoutes);

app.use('/collection-media', collectionMediaRoutes);

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