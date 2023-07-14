const express = require('express');
const ArtistMediaController = require('../controllers/artistMediaController');

const router = express.Router();

router.post('/', ArtistMediaController.create);
router.get('/', ArtistMediaController.getAll);
router.get('/:id', ArtistMediaController.getById);
router.put('/:id', ArtistMediaController.update);
router.delete('/:id', ArtistMediaController.delete);

module.exports = router;
