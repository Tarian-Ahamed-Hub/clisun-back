const mongoose = require("mongoose")

const sessionSchema = mongoose.Schema({
    id:{
        type:String,
        require:true 
        } 
       ,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
    ,
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    token:{
        type:String,
        require:true
    },
    createdOn:{
        type:Date,
        default:Date.now,
        expires:2592000   
    }
})

module.exports = mongoose.model("Session",sessionSchema);