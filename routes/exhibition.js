const express = require('express');
const router = express.Router();
const exhibitionController = require('../controllers/exhibitionController');

// Routes
router.post('/', exhibitionController.createExhibition);
router.get('/', exhibitionController.getAllExhibitions);
router.get('/:id', exhibitionController.getExhibitionById);
router.put('/:id', exhibitionController.updateExhibition);
router.delete('/:id', exhibitionController.deleteExhibition);

module.exports = router;
