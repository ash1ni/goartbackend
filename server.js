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
const port = 3002;

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

app.use('/menu', menuRoutes);

app.use('/artists', artistRoutes);

app.use('/collections', collectionRoutes);

app.use('/artworks', artworkRoutes);

app.use('/exhibitions', exhibitionRouter);

app.use('/events', eventsRouter);

app.use('/multimedia', multimediaRouter);

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