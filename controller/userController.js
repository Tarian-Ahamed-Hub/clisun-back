
const path = require('path');
const {v4:uuidv4} = require("uuid");
const User = require("../models/user")
const bcrypt = require('bcryptjs'); // Change this line

const verify = require("../models/verify")
const sendEmail = require("../utils/verifyEmail")
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const ResetPass = require('../models/ResetPass');


require("dotenv").config();

const createToken = (_id,email,expires) =>{
    const timestamp = new Date().getTime();

 return jwt.sign({_id,timestamp,email},process.env.SECRET,{expiresIn:expires})
}

const mail_otp_save_token = async(user,type)=>{
     //generate otp
     const randomBytes = crypto.randomBytes(4);
     const randomNumber = randomBytes.toString("hex");
     const eightDigitRandomNumber = randomNumber.slice(0, 8);
     //generate otp ends

     //console.log(user._id," ",user.email);

     const token = createToken(user._id,user.email,'5m');
     

     const verifyEmail = await new verify({
        id:uuidv4(),
        userId: user._id,
        email:user.email,
        token:token,
        attemps:1,
        type:type,
        otp:eightDigitRandomNumber.toUpperCase()
    })
    await verifyEmail.save()


    subject = "Email Verification";

    await sendEmail(user.email,subject,eightDigitRandomNumber.toUpperCase())

   return token;
}

exports.addUser = async (req,res)=>{
   
    try {
        const { email, name, password, confirmPassword, address, phone } = req.body;
      
        // Ensure all required fields are provided
        if (!email || !name || !password || !confirmPassword || !address || !phone) {
          return res.status(400).json({
            status: 400,
            message: "All fields are required",
          });
        }
      
        // Check if passwords match
        if (password !== confirmPassword) {
          return res.status(400).json({
            status: 400,
            message: "Passwords do not match",
          });
        }
      
        // Hash password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(password, salt);
      
        // Check if the user exists
        const user = await User.findOne({ email });
        if (user) {
          if (user.verified === true) {
            return res.status(201).json({
              status: 201,
              message: "Account already exists and is verified",
            });
          }
      
          // If the user is not verified, update their details
          user.name = name;
          user.password = hashPassword;
          user.address = address;
          user.phone = phone;
          user.verified = false;
      
          await user.save();
      
          const token = await mail_otp_save_token(user, "register");
      
          return res.status(200).json({
            status: 200,
            redirect: `${process.env.BASE_URL}/verifyEmail/${token}`,
            message: "Verify your email",
          });
        }
      
        // If user doesn't exist, create a new one
        const newUser = new User({
          id: uuidv4(),
          name,
          email,
          password: hashPassword,
          address,
          phone,
          verified: false,
        });
      
        await newUser.save();
      
        const token = await mail_otp_save_token(newUser, "register");
      
        return res.status(200).json({
          status: 200,
          redirect: `${process.env.BASE_URL}/verifyEmail/${token}`,
          message: "Verify your email",
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          status: 500,
          message: "An error occurred. Please try again later.",
        });
      }
 

}

exports.verifyUser = async (req,res)=>{
   
try{
   
    const otp = req.body.otp
    const token = req.body.token
    
    jwt.verify(token, process.env.SECRET, async(err, user) => {
        //if token not valid
        if (err){
         
            //await verify.deleteOne({ token: token});
            return res.status(203).json({
        
                status:203,
                message:"Session Expired.Please Register again",
                redirect:`${process.env.BASE_URL}/register`,

            })
        } 
      else{
//if token valid
        const the_user = await User.findOne({email:user.email})    
    if(the_user){
        if(the_user.verified)
        {
            return res.status(202).json({
            status:202,
            message:"Already Verified",
            redirect:`${process.env.BASE_URL}/home`
        })
       }
       else{
        const inVerify = await verify.findOne({token:token}) 
        if(inVerify){
            if( inVerify && otp===inVerify.otp && inVerify.type==="register"){
                 
                 the_user.verified = true
                 await the_user.save()
    
                await verify.deleteOne({ email: the_user.email, verified: true }); //change struct of inVerify
                return res.status(200).json({
                      status:200,
                      message:"Verified",
                      redirect:`${process.env.BASE_URL}/login`,
                })
            }
            else{
                inVerify.attempts = inVerify.attempts+1;
                
                if(inVerify.attempts>5){
                    await verify.deleteOne({ _id: inVerify._id });
                    return res.status(203).json({
                        status:203,
                        redirect:`${process.env.BASE_URL}/register`,
                        message:"Tried too many times.Register in again"
                    })
                }
            
                 await inVerify.save(); 

                return res.status(202).json({
                    status:202,
                    message:"Invalid OTP"
                })
            }
        }
        else{
            return res.status(205).json({
                status:205,
                message:"Please Register again"
            })
        }

       }
    }
    else{
        return res.status(500).json({
            status:500,
            message:"Something Went Wrong.Register again"
        })
    }

  

        
      }
       
     }
    )


    
   
   
}
catch(err){
    console.log(err)
}
 

}
 

exports.login = async (req,res)=>{
   
try{
   
   
    const email = req.body.email
    const password = req.body.password

   
    

    const user = await User.findOne({email:email})    
    if(user){
        if(user.verified)
        {
            const validCred = await bcrypt.compare(password,user.password)
            if(!validCred){
                return res.status(201).json({
                    status:201,
                    message:"Invalid Credentials"
                })
            }
            else{
                // if(user.role===0){
                //     return res.status(403).json({
                //         status:403,
                //         message:"Forbidden Access.Contact Manager for access"
                //     })
                // }
                
                const token = await mail_otp_save_token(user,"login");
            
                return res.status(200).json({
                    status:200,
                    redirect:`${process.env.BASE_URL}/verifyLogin/${token}`,
                })
               
               
            }
            
        }
       }
       //if user not found
       else{
        return res.status(201).json({
            status:201,
            message:"E-mail not found.Please Register"
        })
       }
    }
   

catch(err){
    console.log(err)
}
 

}

exports.loginVerify = async(req,res)=>{
  
    const token = req.body.token;
    const otp = req.body.otp;

    jwt.verify(token,process.env.SECRET,async(err,user)=>{
      if(err){
        return res.status(203).json({
            status:203,
            message:"Token Expired.Login again",
            redirect:`${process.env.BASE_URL}/login`,
        })
      }
      else{
           const inVerify = await verify.findOne({token:token});
           
           if(inVerify && otp===inVerify.otp && inVerify.type==="login"){
                    const the_user = await User.findOne({email:user.email});
                    const session_token = createToken(the_user._id,the_user.email,'2d');

                    const newSession = new Session({
                     id:uuidv4(),
                     userId:the_user._id,
                     name:the_user.name,
                     email:the_user.email,
                     token:session_token
                  })

                  await newSession.save()
               

                  return res.status(200).json({
                    status:200,
                   token:session_token,
                   role:the_user.role,
                    name:the_user.name,
                        
                    message:"Logged In",
                    redirect:`${process.env.BASE_URL}/home`
                })

                

           }
           else{

            inVerify.attempts = inVerify.attempts+1;
                
                if(inVerify.attempts>5){
                    await verify.deleteOne({ _id: inVerify._id });
                    return res.status(203).json({
                        status:203,
                        message:"Tried too many times.Log in again",
                        redirect:`${process.env.BASE_URL}/login`,
                    })
                }
            
                 await inVerify.save(); 

                return res.status(202).json({
                    status:202,
                    message:"Invalid OTP"
                })
             

           }
         
      
      }

    })


}


exports.logout = async (req,res)=>{
     
    try{
        const token = req.header('Authorization');
        const session = await Session.findOne({token:token})
        if(session){
            await Session.deleteOne({ token:token });

            
        }

        return res.status(200).json({
            status:200,
            message:"Logged out"
        })
      
        }
    catch(err){
        console.log(err)
    }
     
    
    }

exports.sendResetPassLink = async(req,res)=>{
    const email = req.body.email;

    try{
         const the_user =await User.findOne({email:email});
         if(!the_user){
            return res.status(202).json({
                status:202,
                message:"Email Not Found/Verified.Please Register"
            })
         }
         
         const token = createToken(uuidv4(),email,'5m');
         const new_resetPass = new ResetPass({
            id:uuidv4(),
            email:email,
            token:token
         });
         await new_resetPass.save()
         sendEmail(email,"Reset Password",`${process.env.BASE_URL}/resetPass?token=${token}`);

         return res.status(200).json({
            status:200,
            message:"Password Reset Link Has Been Sent To Your Email"
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.resetPass = async(req,res)=>{
     const token = req.body.token;
     const new_password = req.body.password
    
     try{
        jwt.verify(token,process.env.SECRET,async(err,user)=>{
            if(err){
                return res.status(202).json({
                    status:202,
                    message:"Session Expired.Reset Password Again"
                })
              }
              else{
                const resetRecord = await ResetPass.findOne({ token, email: user.email });

                if (!resetRecord) {
                    return res.status(202).json({
                      status: 202,
                      message: "Session Expired. Reset Password Again",
                    });
                  }


                 const the_user = await User.findOne({email:user.email})
                 if(the_user && the_user.verified === true){
                        const salt = await bcrypt.genSalt(Number(process.env.SALT))
                        const hashPassword = await bcrypt.hash(new_password,salt);
                     the_user.password = hashPassword
                     await the_user.save();
                     
                     await ResetPass.deleteOne({ token, email: user.email });

                     return res.status(200).json({
                        status:200,
                        message:"Password Reset Successful"
                    })
                 }
                 else{
                    return res.status(202).json({
                        status:202,
                        message:"Email not found/verified"
                    })
                 }
              }
        }
       )
     }
     catch(err){
        console.log(err)
     }
       
}