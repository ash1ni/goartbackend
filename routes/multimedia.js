const express = require('express');
const router = express.Router();
const multimediaController = require('../controllers/multimediaController');

// Routes for multimedia API
router.get('/', multimediaController.getAllMultimedia);
router.get('/:id', multimediaController.getMultimediaById);
router.post('/', multimediaController.createMultimedia);
router.put('/:id', multimediaController.updateMultimedia);
router.delete('/:id', multimediaController.deleteMultimedia);

module.exports = router;
