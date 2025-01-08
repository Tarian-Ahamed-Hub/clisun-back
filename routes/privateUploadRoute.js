const express = require("express");
const multer = require("multer");
 

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

// Middleware for handling multiple file uploads
const upload = multer({ storage: storage }).array("pics", 10);

module.exports = upload;