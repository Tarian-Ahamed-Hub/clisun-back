const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    email:{
        type:String,
        require:true
    }
})


const attendanceSchema = mongoose.Schema({
    id:{
        type:String,
        require:true
    },
    users:[userSchema],
    createdOn:{
        type:Date,
        default:Date.now
    }
})



module.exports = mongoose.model("Attendance",attendanceSchema);