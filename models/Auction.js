const mongoose = require("mongoose");

const auctionSchema = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model
    required: true,
  },
  curr_price: {
    type: Number,
    required: true,
  },
  time_start: {
    type: Date,
    required: true,
  },
  time_end: {
    type: Date,
    required: true,
  },
  bidding_history: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
      },
      offer: {
        type: Number,
        required: true,
      },
      bid_time: {
        type: Date,
        default: Date.now, // Automatically record the bid time
      },
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now, // Automatically record the auction creation time
  },
});

module.exports = mongoose.model("Auction", auctionSchema);
