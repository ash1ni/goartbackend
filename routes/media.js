const express = require('express');
const MediaController = require('../controllers/mediaController');

const router = express.Router();

router.post('/', MediaController.create);
router.get('/', MediaController.getAll);
router.get('/:id', MediaController.getById);
router.put('/:id', MediaController.update);
router.delete('/:id', MediaController.delete);

module.exports = router;
