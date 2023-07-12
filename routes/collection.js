const express = require('express');
const collectionController = require('../controllers/collectionController');

const router = express.Router();

// GET all collections
router.get('/', collectionController.getAllCollections);

// GET a collection by ID
router.get('/:id', collectionController.getCollectionById);

// CREATE a new collection
router.post('/', collectionController.createCollection);

// UPDATE a collection
router.put('/:id', collectionController.updateCollection);

// DELETE a collection
router.delete('/:id', collectionController.deleteCollection);

module.exports = router;
