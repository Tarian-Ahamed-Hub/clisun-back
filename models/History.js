const mongoose = require("mongoose");

const historySchema = mongoose.Schema({
    roomID: {
        type: mongoose.Schema.Types.ObjectId, // References Room model
        ref: 'Room',
        required: true
    },
    tenantName: {
        type: String,
        required: true
    },
    NID: {
        type: String,
        required: true
    },
    phn_no: {
        type: String,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    paid: {
        type: Number,
        required: true,
        default: 0
    },
    due: {
        type: Number,
        required: true,
        default: 0
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("History", historySchema);
