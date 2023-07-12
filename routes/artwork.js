const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');

// Routes
router.get('/', artworkController.getAllArtwork);
router.post('/', artworkController.createArtwork);
router.get('/:id', artworkController.getArtworkById);
router.put('/:id', artworkController.updateArtwork);
router.delete('/:id', artworkController.deleteArtwork);

module.exports = router;
