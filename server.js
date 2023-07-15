const { readFile, readFileSync, readdirSync, readdir } = require("fs");
const { Readable } = require("stream");
const express = require("express");
const bodyparser = require("body-parser");
const { execSync } = require("node:child_process");
const cors = require("cors");
require('dotenv').config();
const crypto = require("crypto");
// const fs = require("fs");
const path = require("path");
// const session = require('express-session')
// const pgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcrypt');
const passport = require('passport');

const app = express();
const port = process.env.SERVER_PORT;

const { pool } = require('./config/dbConfig');
const sessionMiddleware = require('./middlewares/sessionMiddleware');
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
const artworkMediaRoutes = require('./routes/artworkMedia');
const exhibitionMediaRoutes = require('./routes/exhibitionMedia');
const eventMediaRoutes = require('./routes/eventMedia');

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(sessionMiddleware);
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

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

// const sessionOptions = {
//   store: new pgSession({
//     // Configure the PostgreSQL connection details
//     conString: "postgres://postgres:password@localhost/postgres",
//     tableName: "session",
//   }),
//   secret: process.env.SESSION_SECRET, // Replace with your own session secret
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 30 * 24 * 60 * 60 * 1000, // Set the session duration (30 days in this example)
//     secure: true, // Set to true if using HTTPS
//     httpOnly: true,
//   },
// };




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

app.use('/artwork-media', artworkMediaRoutes);

app.use('/exhibition-media', exhibitionMediaRoutes);

app.use('/event-media', eventMediaRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});