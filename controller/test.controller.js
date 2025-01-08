const path = require('path');
const Pic = require("../models/pic")

exports.upload = (req,res) =>{
    res.sendFile('/views/upload.html', { root: 'public' });
    
}
exports.uploadPost = async (req, res) => {
  try {
    console.log("Files received:", req.files);

    // Check if any files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 400, message: "No files uploaded." });
    }

    const savedFiles = [];

    // Save each uploaded file to the database
    for (const file of req.files) {
      console.log("Processing file:", file.filename);
      const newPic = new Pic({ file: file.filename });
      const savedPic = await newPic.save();
      savedFiles.push(savedPic);
    }

    // Respond with success and list of saved files
    res.status(200).json({
      status: 200,
      message: "Images uploaded successfully.",
      uploadedFiles: savedFiles,
    });
  } catch (err) {
    console.error("Error in uploadPost:", err);
    res.status(500).json({ status: 500, message: "Error uploading images." });
  }
};