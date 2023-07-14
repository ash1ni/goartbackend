const cloudinary = require("../config/cloudinaryConfig");
const Media = require("../models/mediaModel");

const MediaController = {
  async create(req, res) {
    try {
      const { name, folder, status } = req.body;

      // Retrieve the images in the specified folder from Cloudinary
      const { resources } = await cloudinary.search
        .expression(`folder:${folder}/*`)
        .execute();

      // Extract the paths from the retrieved images
      const paths = resources.map((resource) => resource.secure_url);

      // Store the image paths in the PostgreSQL database
      const mediaPromises = paths.map((path) =>
        Media.create(name, path, status)
      );
      const media = await Promise.all(mediaPromises);

      res.status(201).json({ success: true, media });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },

  async getAll(req, res) {
    try {
      const media = await Media.getAll();
      res.status(200).json({ success: true, media });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const media = await Media.getById(id);
      if (!media) {
        return res
          .status(404)
          .json({ success: false, error: "Media not found" });
      }
      res.status(200).json({ success: true, media });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, path, status } = req.body;

      const existingMedia = await Media.getById(id);
      if (!existingMedia) {
        return res
          .status(404)
          .json({ success: false, error: "Media not found" });
      }

      const updatedMedia = await Media.update(id, name, path, status);

      res.status(200).json({ success: true, media: updatedMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existingMedia = await Media.getById(id);
      if (!existingMedia) {
        return res
          .status(404)
          .json({ success: false, error: "Media not found" });
      }

      await Media.delete(id);

      res
        .status(200)
        .json({ success: true, message: "Media deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },
};
module.exports = MediaController;
