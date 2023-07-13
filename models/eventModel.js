const { pool } = require('../config/dbConfig');

// Get all events
const getAllEvents = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM events');
    return rows;
  } catch (error) {
    throw error;
  }
};

// Get a specific event by ID
const getEventById = async (id) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [
      id,
    ]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Create a new event
const createEvent = async (eventData) => {
  const { title, subtitle, content, slug, tags, position, status } = eventData;
  const query =
    'INSERT INTO events (title, subtitle, content, slug, tags, position, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
  const values = [title, subtitle, content, slug, tags, position, status];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Update an existing event
const updateEvent = async (id, eventData) => {
  const { title, subtitle, content, slug, tags, position, status } = eventData;
  const query =
    'UPDATE events SET title = $1, subtitle = $2, content = $3, slug = $4, tags = $5, position = $6, status = $7, updated_at = NOW() WHERE id = $8 RETURNING *';
  const values = [title, subtitle, content, slug, tags, position, status, id];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Delete an event
const deleteEvent = async (id) => {
  const query = 'DELETE FROM events WHERE id = $1 RETURNING *';

  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
