const mongoose = require('mongoose');

const workSession = new mongoose.Schema({
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  duration:{
    type:Number,
    required:true
  },
  ended:{
    type:Boolean,
    required:true
  }
});

const WorkSessionDetail = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId:{
    type:String,
     require:true 
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
 email:{
  type:String,
     require:true 
 },
  workSessions: {
    type: [workSession],
    default: []
  },
   createdOn:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model('WorkSession', WorkSessionDetail);

 
