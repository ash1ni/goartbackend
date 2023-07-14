const express = require('express');
const router = express.Router();
const spotlightArtworkController = require('../controllers/spotlightArtworkController');

router.get('/', spotlightArtworkController.getAllSpotlightArtworks);
router.get('/:id', spotlightArtworkController.getSpotlightArtworkById);
router.post('/', spotlightArtworkController.createSpotlightArtwork);
router.put('/:id', spotlightArtworkController.updateSpotlightArtwork);
router.delete('/:id', spotlightArtworkController.deleteSpotlightArtwork);

module.exports = router;

