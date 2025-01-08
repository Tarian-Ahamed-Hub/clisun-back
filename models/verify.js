const mongoose = require("mongoose")

const verifySchema = mongoose.Schema({

     id:{
     type:String,
     require:true 
     } 
    ,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    email:{
        type:String,
        require:true
    },
    token:{
        type:String,
        required:true
    },
    attempts:{
        type:Number,
        default:0,
        required:true
    },
    type:{
      type:String,
      required:true,
    },
    otp:{
        type:String,
        require:true
    },
   
    createdOn:{
        type:Date,
        default:Date.now,
        expires:300
    }
})

module.exports = mongoose.model("Verify",verifySchema);