const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  curr_price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  pics: {
    type: [String], // Array of image links
    required: true,
  },
  attribute1: {
    type: String, // Optional string
  },
  attribute2: {
    type: String, // Optional string
  },
  attribute3: {
    type: String, // Optional string
  },
  attribute4: {
    type: String, // Optional string
  },
  attribute5: {
    type: String, // Optional string
  },
  attribute6: {
    type: String, // Optional string
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
