const express = require("express");
const WorkSession = require("../models/WorkSession")
const Session = require("../models/Session")
const Room = require("../models/Room");
const user = require("../models/user");
const Attendance = require("../models/Attendance");
const History = require("../models/History");
const Product = require("../models/Product");
const Auction = require("../models/Auction");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
 

require("dotenv").config();




exports.getAuctionDetails  = async (req, res) => {
  const { auctionId } = req.body; // Extract auctionId from the request body

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      return res.status(202).json({
        status: 202,
        message: "Invalid auction ID",
      });
    }

    // Find the auction by ID, exclude `bidding_history`, and populate product details
    const auction = await Auction.findOne({ _id: auctionId })
      .select("-bidding_history") // Exclude `bidding_history` field
      .populate("product_id", "pics name size color  description") // Populate product details, exclude `_id` from product
      .exec();

    // If auction not found, return an appropriate message
    if (!auction) {
      return res.status(202).json({
        status: 202,
        message: "Auction not found",
      });
    }

    // Return the auction details
    return res.status(200).json({
      status: 200,
      message: "Auction details fetched successfully",
      data: auction,
    });
  } catch (error) {
    console.error("Error fetching auction details:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
  };

exports.getAucItems = async (req, res) => {

    try {
        // Get the current time
        const currentTime = new Date();
    
        // Query active auctions
        const auctions = await Auction.find({ time_end: { $gt: currentTime } }) // Check if the auction is still active
          .select("-bidding_history") // Exclude the bidding_history field
          .populate("product_id", "name curr_price size color pics"); // Include specific product fields
    
        // Check if any auctions are found
        if (!auctions.length) {
          return res.status(202).json({
            status: 203,
            message: "No active auctions found",
          });
        }
    
        // Return the active auctions
        return res.status(200).json({
          status: 200,
          message: "Active auctions retrieved successfully",
          auctions,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: 500,
          message: "An error occurred while fetching auctions",
        });
      }


}

exports.placeBid = async (req, res) => {
  const { auctionId, bidAmount } = req.body;
  const userEmail = req.user_email; // Assuming this comes from middleware or session

  try {
    // Validate the auctionId format
    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      return res.status(202).json({
        status: 202,
        message: "Invalid auction ID",
      });
    }

    // Find the auction
    const auction = await Auction.findOne({ _id: auctionId })
      .populate("product_id", "name price");

    // If auction not found, return an error
    if (!auction) {
      return res.status(202).json({
        status: 202,
        message: "Auction not found",
      });
    }

    // Check if the current time is within the auction's time range
    const currentTime = new Date();
    if (currentTime < auction.time_start || currentTime > auction.time_end) {
      return res.status(202).json({
        status: 202,
        message: "Auction is not active or has ended",
      });
    }

    // Check if the bid amount is higher than the current price
    if (bidAmount <= auction.curr_price) {
      return res.status(202).json({
        status: 202,
        message: "Bid amount must be higher than the current price",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(202).json({
        status: 202,
        message: "User not found",
      });
    }

    // Update auction's current price
    auction.curr_price = bidAmount;

    // Add to the bidding history
    auction.bidding_history.push({
      user_id: user._id,
      offer: bidAmount,
      bid_time: currentTime,
    });

    // Save the auction
    await auction.save();

    const io = req.app.get("io");
    // Emit the new bid to all connected clients
    io.emit("newBid", {
      auctionId: auction._id,
      newPrice: auction.curr_price,
    });

    // Respond with success
    return res.status(200).json({
      status: 200,
      message: "Bid placed successfully",
      data: auction,
    });
  } catch (error) {
    console.error("Error placing bid:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};