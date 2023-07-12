// routes/artist.js
const express = require('express');
const router = express.Router();
const {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
} = require('../controllers/artistController');

// GET all artists
router.get('/', getAllArtists);

// GET an artist by ID
router.get('/:id', getArtistById);

// CREATE a new artist
router.post('/', createArtist);

// UPDATE an artist
router.put('/:id', updateArtist);

// DELETE an artist
router.delete('/:id', deleteArtist);

module.exports = router;
