const {validationResult, check} = require("express-validator")

const registerValidation = [
    check("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),
    
    check("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    
    check("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    
    check("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("Confirm Password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
    
    check("address")
      .trim()
      .notEmpty()
      .withMessage("Address is required"),
    
    check("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .isMobilePhone()
      .withMessage("Invalid phone number format"),
    
    (req, res, next) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(202).json({status:202, errors: errors.array() });
      }
  
      next();
    }
  ];

const loginValidation= [
    check("email").trim()
    .notEmpty().withMessage("email required"),
    
    check("password").trim()
    .notEmpty().withMessage("password required")
    ,
    
    (req,res,next)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
   
    next();

    }
    
]

module.exports = {
    registerValidation,loginValidation
}