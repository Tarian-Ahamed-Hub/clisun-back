const jwt = require('jsonwebtoken');
const User = require("../models/user");


const isEmployee = (req, res, next) => {
  const token = req.header('Authorization');
  // console.log(token)
  if (!token) return res.status(401).json({
    status:401,
    message:"Not authorized"
})

  jwt.verify(token, process.env.SECRET, async(err, user) => {
    //not valid
    if (err) return res.status(403).json({
      status:403,
      message:"Logget out.Please login again"
  })
    //If valid
    const the_user = await User.findOne({_id:user._id})
    //If user has portal access
    if(the_user.role===1){
        req.user=user
        next();
    }
   //If no access
   else{
    return res.status(401).json({
        status:401,
        message:"You do not have access"
    })
   }
  });
};

module.exports = isEmployee;
