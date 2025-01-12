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
 
 
require("dotenv").config();

exports.getAuctionDetails = async (req, res) => {
    try {
      // Fetch auctions with populated product and bidding history
      const auctions = await Auction.find()
        .populate({
          path: "product_id", // Populate product details
          select: "name pics description price", // Select fields to return
        })
        .populate({
          path: "bidding_history.user_id", // Populate user details in bidding history
          select: "name email", // Select fields to return
        });
  
      // Check if auctions were found
      if (auctions.length === 0) {
        return res.status(202).json({
          status: 202,
          message: "No auctions found",
        });
      }
  
      // Return the auction details
      return res.status(200).json({
        status: 200,
        message: "Auction details fetched successfully",
        data: auctions,
      });
    } catch (error) {
      console.error("Error fetching auction details:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  };

exports.setPermission = async (req, res) => {
  const { email, yes } = req.body;

  try {
    // Validate if email is provided
    if (!email) {
      return res.status(202).json({
        status: 202,
        message: "Email is required",
      });
    }

    // Find user and update role
    const the_user = await user.findOne({ email });

    // Check if user exists
    if (!the_user) {
      return res.status(202).json({
        status: 202,
        message: "User not found",
      });
    }

    // Set role based on 'yes' parameter
    const newRole = yes ? 2 : 0;
  console.log(newRole)
    // Update user role
    const userToUpdate = await user.findOne({ email });


    the_user.role = newRole;
    await the_user.save();
  


    return res.status(200).json({
      status: 200,
      message: "Permission updated successfully",
     
    });

  } catch (error) {
    console.error("Error updating permission:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    // Find all users except those with role=1
    // Select only email and role fields
    const users = await user.find({ role: { $ne: 1 } })
      .select("email role -_id")
      .exec();

    // If no users found
    if (!users || users.length === 0) {
      return res.status(202).json({
        status: 202,
        message: "No users found",
      });
    }

    // Return the users data
    return res.status(200).json({
      status: 200,
      message: "User details fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.addToQueue = async (req, res) => {
    const { productId, auctionStarts, auctionEnds, startingPrice } = req.body;

  if (!productId || !auctionStarts || !auctionEnds || !startingPrice) {
    return res
      .status(202)
      .json({ status: 202, message: "Missing required fields" });
  }

  if (new Date(auctionStarts) >= new Date(auctionEnds)) {
    return res
      .status(202)
      .json({ status: 202, message: "Auction start time must be before the end time." });
  }

  try {
    const newAuction = new Auction({
      product_id: new mongoose.Types.ObjectId(productId), // Use `new` keyword here
      curr_price: parseFloat(startingPrice),
      time_start: new Date(auctionStarts),
      time_end: new Date(auctionEnds),
      bidding_history: [],
    });

    await newAuction.save();

    return res.status(200).json({
      status: 200,
      message: "Auction added to the queue successfully.",
    });
  } catch (error) {
    console.error("Error adding auction:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Failed to add auction to the queue.", error: error.message });
  }
};

 


exports.addProduct = async (req, res) => {
    try {
      const {
        name,
        sku,
        curr_price,
        size,
        color,
        stock,
        description,
        attribute1,
        attribute2,
        attribute3,
        attribute4,
        attribute5,
        attribute6,
      } = req.body;
  
      // Ensure the required fields are provided
      if (!description || !name || !sku || !curr_price || !size || !color || stock === undefined) {
        return res.status(202).json({status:202, message: "Missing required fields" });
      }
  
      // Handle file uploads
      const pics = req.files?.map((file) => file.path) || [];
  
      if (pics.length === 0) {
        return res.status(202).json({status:202, message: "At least one image is required" });
      }
  
      // Create and save the product
      const product = new Product({
        name,
        sku,
        curr_price,
        size,
        color,
        stock,
        pics,
        description,
        attribute1,
        attribute2,
        attribute3,
        attribute4,
        attribute5,
        attribute6,
      });
  
      await product.save();
  
      return res.status(200).json({status:200, message: "Product added successfully", product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
 
  exports.getAllProducts = async (req, res) => {
    try {
      // Fetch all products from the database
      const products = await Product.find();
  
      // Check if products exist
      if (products.length === 0) {
        return res.status(202).json({
          status: 202,
          message: "No products found",
          products: [],
        });
      }
  
      // Return the products with a success message
      return res.status(200).json({
        status: 200,
        message: "Products retrieved successfully",
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        status: 500,
        message: "Server error",
        error: error.message,
      });
    }
  };
 

exports.createRoom = async (req, res) => {
    try {
        const { name, rent } = req.body;

        // Check if the room name and rent are provided
        if (!name) {
            return res.status(202).json({ status: 202, message: "Room name is required" });
        }
        if (rent === undefined) {  // Check if rent is provided
            return res.status(202).json({ status: 202, message: "Rent is required" });
        }

        // Check if a room with the same name already exists
        const existingRoom = await Room.findOne({ name });
        if (existingRoom) {
            return res.status(202).json({ status: 202, message: "Room with this name already exists" });
        }

        // Create a new room with the provided name, rent, and an empty tenants array
        const room = new Room({
            name,
            rent,  // Set rent from the request body
            tenants: [] // Initializing tenants as an empty array
        });

        // Save the room in the database
        await room.save();

        // Send success response
        return res.status(201).json({ status: 201, message: "Room created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "Server error. Please try again later." });
    }
};
  
 

// Update tenant information based on NID
exports.updateTenant = async (req, res) => {
    const { roomName, NID, name, hometown, phn_no, rent } = req.body; // Ensure all necessary fields are included

    // Validate input
    if (!roomName || !NID || !name || !hometown || !phn_no || rent === undefined) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find the room by name
        const room = await Room.findOne({ name: roomName });

        if (!room) {
            // If the room is not found, return a 404 status code
            return res.status(404).json({status: 404,  message: "Room not found" });
        }

        // Find the tenant within the tenants array by NID
        const tenant = room.tenants.find(tenant => tenant.NID === NID);
        
        if (!tenant) {
            return res.status(404).json({status: 404,  message: "Tenant not found in this room" });
        }

        // Update tenant details
        tenant.name = name;
        tenant.hometown = hometown;
        // tenant.phn_no = phn_no;
        tenant.rent = rent; // Ensure rent is updated as well

        // Save the updated room document
        await room.save();

        // Return a success response
        return res.status(200).json({ status: 200, message: "Tenant updated successfully" });
    } catch (error) {
        console.error(error);
        // Handle server error
        return res.status(500).json({ status: 500, message: "Server error" });
    }
};
 

exports.getAllRoomsWithTenants = async (req, res) => {
    try {
        // Retrieve all rooms and populate the tenants array
        const rooms = await Room.find().populate('tenants');

        if (!rooms || rooms.length === 0) {
            return res.status(202).json({ status: 202, message: "No rooms found" });
        }

        // Return success response with rooms data
        return res.status(200).json({ status: 200, data: rooms });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "Server error. Please try again later." });
    }
};

exports.removeTenant = async (req, res) => {
    const { roomId, NID } = req.body.data; // Extract roomId and NID from the request body
    
    // Validate input
    if (!roomId || !NID) {
        return res.status(202).json({ status: 202, message: "Room ID and Tenant NID are required." });
    }

    try {
        // Find the room by ID
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(202).json({ status: 202, message: "Room not found." });
        }

        // Find the index of the tenant to remove
        const tenantIndex = room.tenants.findIndex(tenant => tenant.NID === NID);
        if (tenantIndex === -1) {
            return res.status(202).json({ status: 202, message: "Tenant not found in the room." });
        }

        // Remove the tenant from the tenants array
        room.tenants.splice(tenantIndex, 1);
        
        // Save the updated room document
        await room.save();

        return res.status(200).json({ status: 200, message: "Tenant removed successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "Server error. Please try again later." });
    }
};


exports.addTenantToRoom = async (req, res) => {
    try {
        const { name, NID, hometown, phn_no, rent, roomName } = req.body;
  
        // Validate tenant details
        if (!name || !NID || !hometown || !phn_no || rent === undefined) {
            return res.status(202).json({ status: 202, message: "All tenant details, including rent, are required" });
        }
  
        // Find the room by its name
        const room = await Room.findOne({ name: roomName });
  
        if (!room) {
            return res.status(202).json({ status: 202, message: "Room not found" });
        }
  
        // Check if tenant with the same NID already exists in this room
        const existingTenant = room.tenants.find(tenant => tenant.NID === NID);
        if (existingTenant) {
            return res.status(202).json({ status: 202, message: "Tenant with this NID already exists in this room" });
        }
  
        // Add the new tenant to the tenants array
        room.tenants.push({ name, NID, hometown, phn_no, rent });
  
        // Save the updated room document
        await room.save();
  
        return res.status(200).json({ status: 200, message: "Tenant added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "Server error. Please try again later." });
    }
  };
  


exports.updateRoom = async (req, res) => {
    try {
        
        const { name, rent, tenants } = req.body; // New data for room
        
        // Check if required fields are provided
        if (!name || !rent) {
            return res.status(202).json({  status:202, message: "Room name and rent are required" });
        }

        // Find the room by name
        const room = await Room.findOne({ name: name });

        if (!room) {
            return res.status(202).json({  status:202, message: "Room not found" });
        }

        // Update room fields
        room.name = name;
        room.rent = rent;

        // If tenants array is provided, update it
        if (tenants && Array.isArray(tenants)) {
            room.tenants = tenants; // Directly replace tenants array
        }

        // Save the updated room document
        await room.save();

        return res.status(200).json({  status:202, message: "Room updated successfully", room });
    } catch (error) {
        console.error(error);
        return res.status(500).json({  status:500, message: "Server error. Please try again later." });
    }
};


exports.createOrUpdateHistory = async (req, res) => {
    try {
        const { roomName, tenantName, NID, phn_no, rent, paid, month, year } = req.body;

        // Validate required fields
        if (!roomName || !tenantName || !NID || !phn_no || !rent  || !month || !year) {
            return res.status(202).json({ status: 202, message: "All fields are required." });
        }

        // Find the room by its name
        const room = await Room.findOne({ name: roomName });
        if (!room) {
            return res.status(202).json({ status: 202, message: "Room not found." });
        }

        const roomID = room._id; // Get the room ID after finding by name

        // Check if a history record already exists for the room, tenant, month, and year
        let historyRecord = await History.findOne({ roomID, tenantName, NID, month, year });

        if (historyRecord) {
            // If record exists, add the paid amount and update due
            historyRecord.paid += Number(paid); // Ensure 'paid' is treated as a number
            historyRecord.due = Math.max(0, historyRecord.rent - historyRecord.paid); // Update due, ensuring it's not negative
            await historyRecord.save();

            return res.status(200).json({ status: 200, message: "Rent history updated successfully." });
        } else {
            // If no record exists, create a new history record
            const due = Math.max(0, rent - paid); // Calculate due amount
            const newHistory = new History({
                roomID,
                tenantName,
                NID,
                phn_no,
                rent,
                paid: Number(paid), // Ensure 'paid' is a number
                due,
                month,
                year
            });

            // Save the new history record in the database
            await newHistory.save();

            return res.status(200).json({ status: 200, message: "Added rent successfully." });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "Server error. Please try again later." });
    }
};

exports.getHistoryByMonthYear = async (req, res) => {
    try {
        let { month, year, phn_no } = req.body;

        // Build the query object based on the provided parameters
        let query = {};
        if (phn_no) {
            query.phn_no = phn_no; // Filter by phn_no if provided
        }
        if (month) {
            query.month = month; // Filter by month if provided
        }
        if (year) {
            query.year = year; // Filter by year if provided
        }

        // Fetch history records based on the built query
        const historyRecords = await History.find(query).populate('roomID'); // Populate roomID to get room details

        // Initialize an array to store aggregated results
        const aggregatedResults = [];
        let totalPaid = 0; // Initialize totalPaid
        let totalDue = 0; // Initialize totalDue

        // Aggregate results
        historyRecords.forEach(record => {
            const roomName = record.roomID.name; // Get the room name
            const recordMonth = record.month; // Get the month from the record
            const recordYear = record.year; // Get the year from the record

           

            // Find if an entry already exists for this room, month, and year
            const existingEntry = aggregatedResults.find(entry =>
                entry.roomName === roomName &&
                entry.month === recordMonth &&
                entry.year === recordYear
            );

            if (existingEntry) {
                // If it exists, update the paid and due amounts
                existingEntry.paid += record.paid;
                existingEntry.due += record.due;
            } else {
                // If it does not exist, create a new entry
                aggregatedResults.push({
                    roomName,
                    month: recordMonth,
                    year: recordYear,
                    paid: record.paid,
                    due: record.due
                });
            }

            // Update the total paid and total due
            totalPaid += record.paid;
            totalDue += record.due;
        });

        if (phn_no) {
            // Calculate total received and total outstanding for the specific tenant
            const tenantpaid = historyRecords.reduce((sum, record) => sum + record.paid, 0);
            const tenantdue = historyRecords.reduce((sum, record) => sum + record.due, 0);
            return res.status(200).json({
                status: 200,
                message: "Tenant history retrieved successfully.",
                data: aggregatedResults,
                totalPaid: tenantpaid,
                totalDue: tenantdue
            });
        }

        // If phn_no is not provided, return aggregated history records
        return res.status(200).json({
            status: 200,
            message: "History retrieved successfully.",
            data: aggregatedResults,
            totalPaid, // Include totalPaid outside of the data array
            totalDue // Include totalDue outside of the data array
        });

    } catch (error) {
        console.error("Error in getHistoryByMonthYear:", error); // Log specific error
        return res.status(500).json({ status: 500, message: "Server error. Please try again later." });
    }
};

exports.getRoomNameAndRent = async (req, res) => {
    try {
        const roomName = req.body.roomName; // Get room name from request params

        // Find room by name
        const room = await Room.findOne({ name: roomName });

        // Check if the room exists
        if (!room) {
            return res.status(202).json({ status: 202, message: "Room not found" });
        }

        // Return room name and rent
        return res.status(200).json({
            status: 200,
            name: room.name,
            rent: room.rent
        });
    } catch (error) {
        // Handle errors with server response
        return res.status(500).json({
            status: 500,
            message: "Server error. Please try again later.",
          
        });
    }
};

exports.updateRoomDetails = async (req, res) => {
    try {
        const { newName, newRent, roomName } = req.body; // Destructure new name, new rent, and current room name from the request body

        // Log the received names and rent for debugging
        console.log("Updating room:", roomName, "to new name:", newName, "and new rent:", newRent);

        // Find room by current name
        const room = await Room.findOne({ name: roomName });

        // Check if the room exists
        if (!room) {
            return res.status(202).json({ status: 202, message: "Room not found" }); // Use 404 for not found
        }

        // Update the room's name if provided in the request
        if (newName) {
            room.name = newName;
        }

        // Update the room's rent if provided in the request
        if (newRent !== undefined) { // Check if newRent is defined
            room.rent = newRent; // Update rent
        }

        // Save the updated room to the database
        await room.save();

        // Return success response
        return res.status(200).json({
            status: 200,
            message: "Room details updated successfully",
            updatedRoom: room // Optionally, return the updated room details
        });
    } catch (error) {
        // Handle errors with server response
        return res.status(500).json({
            status: 500,
            message: "Server error. Please try again later.",
            error: error.message
        });
    }
};
