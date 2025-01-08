const jwt = require('jsonwebtoken');
const User = require("../models/user")


const isEmployee = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({
    status:401,
    message:"Not authorized"
})

  jwt.verify(token, process.env.SECRET, async(err, user) => {
    //jwt checks validity
    if (err) return res.status(403).json({
      status:401,
      message:"Logged out.Please log in again"
  })
    //If valid
    const the_user = await User.findOne({_id:user._id})
    //If employee
    if(the_user.role>0 && the_user.role <=2){
        req.user=user
        req.user_email = the_user.email
        next();
    }
   //If not employee
   else{
    return res.status(202).json({
        status:202,
        message:"You are not Verified.Please contact an admin"
    })
   }
  });
};

module.exports = isEmployee;
