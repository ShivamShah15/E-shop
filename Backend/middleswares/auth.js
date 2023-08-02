const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User")

exports.auth = (req, res, next) => {
    try {
        // get token from the Authorization header
        const authHeader= req.headers.authorization || req.body.token
        || req.cookies.token;
        // validate the token
        console.log(authHeader);
        if (!authHeader && !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization token not provided"
            });
        }
        // extract the token from the authHeader
        let token = null;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        } else {
          token = authHeader; // If token is sent in the request body directly
        }
    // validate the token
    console.log(token);
    if(!token)
    {
    return res.status(404).json({
        success:false,
        message:"we can't get token"
    })
    }
    console.log(token)
        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({
                success: false,
                message: "Token verification failed"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in auth middleware"
        });
    }
};
//isConsumer
exports.isConsumer = async (req, res, next) => {
    try{
           if(req.user.accountType !== "User") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for User only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }
   
   
   //isSeller
   exports.isSeller = async (req, res, next) => {
       try{
              if(req.user.accountType !== "Seller") {
                  return res.status(401).json({
                      success:false,
                      message:'This is a protected route for Seller only',
                  });
              }
              next();
       }
       catch(error) {
          return res.status(500).json({
              success:false,
              message:'Seller role cannot be verified, please try again'
          })
       }
      }
   
   
   //isAdmin
   exports.isAdmin = async (req, res, next) => {
       try{   
              console.log(req.user); 
              console.log("Printing AccountType ", req.user.accountType);
              if(req.user.accountType !== "Admin") {
                  return res.status(401).json({
                      success:false,
                      message:'This is a protected route for Admin only',
                  });
              }
              next();
       }
       catch(error) {
          return res.status(500).json({
              success:false,
              message:'User role cannot be verified, please try again'
          })
       }
      }

      exports.isDelivery = async (req, res, next) => {
        try{  
            const {accountType}=req.body; 
     
            //    console.log("Printing AccountType ", req.user.accountType);
               if(accountType !== "DeliveryBoy") {
                   return res.status(401).json({
                       success:false,
                       message:'This is a protected route for delivery boy only',
                   });
               }
               next();
        }
        catch(error) {
            console.log(error);
           return res.status(500).json({
               success:false,
               message:'User role cannot be verified, please try again'
           })
        }
       }