const { pool } = require('../config/dbConfig');
// Get all artwork
const getAllArtwork = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM artwork');
    return rows;
  } catch (error) {
    throw new Error('Error retrieving artwork');
  }
};

// Create artwork
const createArtwork = async (artworkData) => {
  const {
    collection_id,
    name,
    slug,
    title,
    description,
    content,
    tags,
    meta,
    status,
  } = artworkData;
  const createdAt = new Date();
  const updatedAt = createdAt;

  try {
    const { rows } = await pool.query(
      `INSERT INTO artwork (collection_id, name, slug, title, description, content, tags, meta, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        collection_id,
        name,
        slug,
        title,
        description,
        content,
        tags,
        meta,
        status,
        createdAt,
        updatedAt,
      ]
    );

    return rows[0];
  } catch (error) {
    throw new Error('Error creating artwork');
  }
};

// Get artwork by ID
const getArtworkById = async (artworkId) => {
  try {
    const { rows } = await pool.query('SELECT * FROM artwork WHERE id = $1', [
      artworkId,
    ]);
    if (rows.length === 0) {
      throw new Error('Artwork not found');
    }
    return rows[0];
  } catch (error) {
    throw new Error('Error retrieving artwork');
  }
};

// Update artwork
const updateArtwork = async (artworkId, artworkData) => {
  const {
    collection_id,
    name,
    slug,
    title,
    description,
    content,
    tags,
    meta,
    status,
  } = artworkData;
  const updatedAt = new Date();

  try {
    const { rows } = await pool.query(
      `UPDATE artwork SET
       collection_id = $1, name = $2, slug = $3, title = $4, description = $5,
       content = $6, tags = $7, meta = $8, status = $9, updated_at = $10
       WHERE id = $11
       RETURNING *`,
      [
        collection_id,
        name,
        slug,
        title,
        description,
        content,
        tags,
        meta,
        status,
        updatedAt,
        artworkId,
      ]
    );

    if (rows.length === 0) {
      throw new Error('Artwork not found');
    }
    return rows[0];
  } catch (error) {
    throw new Error('Error updating artwork');
  }
};

// Delete artwork
const deleteArtwork = async (artworkId) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM artwork WHERE id = $1 RETURNING *',
      [artworkId]
    );

    if (rows.length === 0) {
      throw new Error('Artwork not found');
    }
  } catch (error) {
    throw new Error('Error deleting artwork');
  }
};

module.exports = {
  getAllArtwork,
  createArtwork,
  getArtworkById,
  updateArtwork,
  deleteArtwork,
};
