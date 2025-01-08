const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

// Tenant schema for nested tenants in Room
const tenantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    NID: {
        type: String,
       
        required: true
    },
    hometown: {
        type: String,
        required: true
    },
    phn_no: {
        type: String,
        required: true
    }
    ,
    rent: {
        type: Number,
        required: true
    }

});

// Room schema
const roomSchema = mongoose.Schema({
    uuid: {
        type: String,
        default: uuidv4, // Auto-generate unique uuid for each room
        unique: true
    },
    name: {
        type: String,
        unique: true,  // Ensure room names are unique
        required: true
    },
   
    tenants: [tenantSchema],
    rent: {
        type: Number,
        required: true
    },  
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Room", roomSchema);

