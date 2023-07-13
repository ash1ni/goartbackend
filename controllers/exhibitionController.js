const Exhibition = require('../models/exhibitionModel');

exports.createExhibition = async (req, res) => {
  try {
    const exhibitionData = req.body;
    const createdExhibition = await Exhibition.createExhibition(exhibitionData);
    res.status(201).json(createdExhibition);
  } catch (error) {
    console.error('Error creating exhibition:', error);
    res.status(500).json({ error: 'An error occurred while creating the exhibition.' });
  }
};

exports.getAllExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.getAllExhibitions();
    res.json(exhibitions);
  } catch (error) {
    console.error('Error getting exhibitions:', error);
    res.status(500).json({ error: 'An error occurred while retrieving exhibitions.' });
  }
};

exports.getExhibitionById = async (req, res) => {
  try {
    const { id } = req.params;
    const exhibition = await Exhibition.getExhibitionById(id);
    res.json(exhibition);
  } catch (error) {
    console.error('Error getting exhibition:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the exhibition.' });
  }
};

exports.updateExhibition = async (req, res) => {
  try {
    const { id } = req.params;
    const exhibitionData = req.body;
    const updatedExhibition = await Exhibition.updateExhibition(id, exhibitionData);
    res.json(updatedExhibition);
  } catch (error) {
    console.error('Error updating exhibition:', error);
    res.status(500).json({ error: 'An error occurred while updating the exhibition.' });
  }
};

exports.deleteExhibition = async (req, res) => {
  try {
    const { id } = req.params;
    await Exhibition.deleteExhibition(id);
    res.json({ message: 'Exhibition deleted successfully.' });
  } catch (error) {
    console.error('Error deleting exhibition:', error);
    res.status(500).json({ error: 'An error occurred while deleting the exhibition.' });
  }
};
