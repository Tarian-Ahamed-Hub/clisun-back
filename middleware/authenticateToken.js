const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({
      status:401,
      message:"Token not found"
  })

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.status(402).json({
      status:402,
      message:"Invalid/Expired Token"
  })
    

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
