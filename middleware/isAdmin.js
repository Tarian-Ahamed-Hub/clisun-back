const jwt = require('jsonwebtoken');
const User = require("../models/user")


const isAdmin = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({
    status:401,
    message:"Not authorized"
})

  jwt.verify(token, process.env.SECRET, async(err, user) => {
    //jwt checks validity
    if(err) return res.status(403).json({
      status:401,
      message:"Session Expired"
  })
    //If valid
    const the_user = await User.findOne({_id:user._id})
    //If Admin
    if(the_user.role===1){
        req.user=user
        req.user_email = the_user.email
        next();
    }
   //If not admin
   else{
    return res.status(402).json({
        status:403,
        message:"You are not an admin"
    })
   }
  });
};

module.exports = isAdmin;
