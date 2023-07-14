const eventModel = require('../models/eventModel');

// Controller for getting all events
const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for getting a specific event by ID
const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await eventModel.getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error retrieving event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for creating a new event
const createEvent = async (req, res) => {
  const eventData = req.body;

  try {
    const newEvent = await eventModel.createEvent(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for updating an existing event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const eventData = req.body;

  try {
    const updatedEvent = await eventModel.updateEvent(id, eventData);
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for deleting an event
const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await eventModel.deleteEvent(id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
