const express = require('express');
const router = express.Router();
const eventArtworkController = require('../controllers/eventArtworkController');

router.get('/', eventArtworkController.getAllEventArtworks);
router.get('/:id', eventArtworkController.getEventArtworkById);
router.post('/', eventArtworkController.createEventArtwork);
router.put('/:id', eventArtworkController.updateEventArtwork);
router.delete('/:id', eventArtworkController.deleteEventArtwork);

module.exports = router;
