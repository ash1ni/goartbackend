const express = require('express');
const ExhibitionMediaController = require('../controllers/exhibitionMediaController');

const router = express.Router();

router.post('/', ExhibitionMediaController.create);
router.get('/', ExhibitionMediaController.getAll);
router.get('/:id', ExhibitionMediaController.getById);
router.put('/:id', ExhibitionMediaController.update);
router.delete('/:id', ExhibitionMediaController.delete);

module.exports = router;
