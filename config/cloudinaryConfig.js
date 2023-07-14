const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_credentials: process.env.CLOUDINARY_URL
});

module.exports = cloudinary;
