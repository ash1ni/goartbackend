const express = require('express');
const pickArtworkController = require('../controllers/pickArtworkController');

const router = express.Router();

// Routes for pick artworks
router.get('/', pickArtworkController.getAllPickArtworks);
router.get('/:id', pickArtworkController.getPickArtworkById);
router.post('/', pickArtworkController.createPickArtwork);
router.put('/:id', pickArtworkController.updatePickArtwork);
router.delete('/:id', pickArtworkController.deletePickArtwork);

module.exports = router;