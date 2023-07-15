const express = require('express');
const CollectionMediaController = require('../controllers/collectionMediaController');

const router = express.Router();

router.post('/', CollectionMediaController.create);
router.get('/', CollectionMediaController.getAll);
router.get('/:id', CollectionMediaController.getById);
router.put('/:id', CollectionMediaController.update);
router.delete('/:id', CollectionMediaController.delete);

module.exports = router;
