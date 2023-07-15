const express = require('express');
const ArtworkMediaController = require('../controllers/artworkMediaController');

const router = express.Router();

router.post('/', ArtworkMediaController.create);
router.get('/', ArtworkMediaController.getAll);
router.get('/:id', ArtworkMediaController.getById);
router.put('/:id', ArtworkMediaController.update);
router.delete('/:id', ArtworkMediaController.delete);

module.exports = router;
