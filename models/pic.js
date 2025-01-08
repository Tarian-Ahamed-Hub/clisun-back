const mongoose = require("mongoose")

const picSchema = mongoose.Schema({
    id:{
        type:String,
        require:true
    },
    file:{
        type:String,
        require:true
    },
    createdOn:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Pic",picSchema);