const mongoose = require("mongoose")

const resetPassSchema = mongoose.Schema({

     id:{
     type:String,
     require:true 
     } 
    ,
    email:{
        type:String,
        require:true
    },
    token:{
        type:String,
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now,
        expires:300
    }
})

module.exports = mongoose.model("ResetPass",resetPassSchema);