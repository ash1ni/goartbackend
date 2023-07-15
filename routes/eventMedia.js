const express = require('express');
const EventMediaController = require('../controllers/eventMediaController');

const router = express.Router();

router.post('/', EventMediaController.create);
router.get('/', EventMediaController.getAll);
router.get('/:id', EventMediaController.getById);
router.put('/:id', EventMediaController.update);
router.delete('/:id', EventMediaController.delete);

module.exports = router;
