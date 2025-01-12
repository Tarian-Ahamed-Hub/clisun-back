const mongoose = require("mongoose")
const dev = require("./config")
process.env.TZ = 'Asia/Dhaka';
const db_url = process.env.DB_URL;


const connect=async()=>{
    try{
        await mongoose.connect(db_url)
        console.log("DB connected")
        
    }
    catch(err){
        console.log(err)
    }
}

connect();

module.exports = { connect };