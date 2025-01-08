
const express = require("express");
const router = express.Router()
const {registerValidation, loginValidation} = require("../validators/validators")
const {body, validationResult, check} = require("express-validator")
const { addUser,verifyUser, login, logout, loginVerify, sendResetPassLink, resetPass } = require("../controller/userController");
const passport = require('passport');
const authenticateToken = require("../middleware/authenticateToken");
const Session = require("../models/Session");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

router.post("/loggedIn",
    async (req,res)=>{
       const token = req.body.token;
       
       jwt.verify(token, process.env.SECRET, async(err, user) => {
        if (err) {
            return res.status(402).json({
                status:402,
                message:"Invalid/Expired Token"
            })
        }
        else{
            const token_in_session = await Session.findOne({ token });
            const the_user = await User.findOne({ email:token_in_session.email });
            if(token_in_session){
                return res.status(200).json({
                    status:200,
                    role:the_user.role,
                    message:"Logged In"
                })
            }
            else{
                return res.status(402).json({
                    status:402,
                    message:"Invalid/Expired Token"
                })
            }
           
        }
        
    
      });


    }
    );


router.post("/register",
//validator
registerValidation
,
//controller
addUser
);

router.post("/login",
//validator
loginValidation,    
//controller
login
);



router.post("/verifyEmail",
//controller
verifyUser
);

router.post("/verifyLogin",
    //controller
    loginVerify
    );

    router.post("/resetPass",
        //controller
        sendResetPassLink
        );
        router.post("/setPass",
            //controller
            resetPass
            );

router.post("/logout",
//controller

logout
);



 


module.exports = router;