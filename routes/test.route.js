const express = require("express")
const multer  = require('multer')


const route = express.Router()
const testController = require("../controller/test.controller")




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images/")
    },
    filename: function (req, file, cb) {
      const name = + Date.now()+ '-' +file.originalname; 
      cb(null, name)
    }
  })
  
  const upload = multer({ storage: storage }).single('image');

 

  


route.get("/upload",testController.upload);
route.post("/upload",upload,testController.uploadPost);

module.exports = route;