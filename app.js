const express = require("express");
const bodyParser = require("body-parser")
const router = express.Router();
const app = express();
const multer = require("multer") 
// const cookieSession = require("cookie-session")
const session = require("express-session");
const userRouter = require("./routes/publicRoutes");
const userRoutes = require("./routes/userRoutes");
const testRouter = require("./routes/test.route");
const privateRoutes = require("./routes/privateRoutes");
const privateUploadRoutes =  require("./routes/privateUploadRoute");
const isAdmin = require('./middleware/isAdmin')

require("dotenv").config();
const {msz} = require("./config/db") 
 
const cors = require("cors");
const crypto = require("crypto");
const hasAccess = require("./middleware/hasAccess");
const isEmployee = require("./middleware/isEmployee");
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
//https://zihan.alamgirenterprise.com
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(jsonParser)
app.use(urlencodedParser)
const PORT = process.env.PORT;
//

 

//static directory
app.use('/api/public', express.static('public'));


//app.use('/api/private',isAdmin, express.static('private'));
 



//for important routes for front-end
app.use("/api/checkAuthenticity",hasAccess,(req,res)=>{
    res.status(200).json({
        status:200,
        message:"has access"
        
  })
})

//middleware for portal
app.use("/api/portal",hasAccess);


//public routes
app.use("/api",userRouter);

//private routes
app.use("/api/portal",privateRoutes);

app.use("/api/verified",isEmployee,userRoutes);

//app.use("/api/public",testRouter)

app.use("/api/private",privateUploadRoutes)


//if route not found
app.use("*",(req,res)=>{
    res.send("404 not found")
    res.end()
})



module.exports = {
    app,
    PORT
};





 