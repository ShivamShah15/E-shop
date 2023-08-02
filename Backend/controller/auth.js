const SendMail=require("../models/SendMail");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User = require("../models/User");
const UserProfile=require("../models/userProfile");
const SellerProfile=require("../models/sellerProfile");
require("dotenv").config();

// sendmail for user
exports.sendmail=async(req,res)=>{
    try {
        // get email
        const {email,confirmation}=req.body;
        // validate
        if(!email || !confirmation)
        {
            return res.status(404).json({
                success:false,
                message:"email is not fetched from frontend"
            })
        }
        // check email is present or not
        const checkEmail=await SendMail.findOne({email});
        if(checkEmail)
        {
            return res.status(404).json({
                success:false,
                message:"user already exist"
            });
        }
        // create email entry in database
        const body=await SendMail.create({email,confirmation});
        // return response
        return res.status(200).json({
            success:true,
            message:"send mail controller work successfully"
        })


    } catch (error) {
        console.log(error);
        return res.status({
            success:false,
            message:"error in sending mail to the user"
        })
    }
}


// signup
exports.signup=async(req,res)=>{
    try {
        // data fetch from frontend
        const {name,email,password,confirmation,accountType}=req.body;
        // validate the user data
        if(!name || !email || !password || !confirmation || !accountType)
        {

            return res.status(404).json({
                success:false,
                message:"data is not fetched from frontend",
                name,email,password,confirmation,accountType
            })
        }
        // check user is already present or not
        const userExistence=await User.findOne({email});
        if(userExistence)
        {
            return res.status(404).json({
                success:false,
                message:"user is already registered"
            })
        }
        // check confirmation and match email is present in SendMail or not
        if(!confirmation)
        {
           const checkEmail=await SendMail.findOne({email});
           if(!checkEmail)
           {return res.status(404).json({
            success:false,
            message:"please sendmail to the user"
           })}
        }
        
        // do hashing of password
        const hashpassword=await bcrypt.hash(password,10);
        // fake profile created
        if(accountType==='User')
        {
            let profileDetail=await UserProfile.create({
                gender:null,
                dateOfBirth:null,
                about:"Whatapp guys! Welcome to E-shop",
                contactNumber:null
              })
              const user=await User.create({
                name,email,password:hashpassword,accountType,
                confirmation,
                useradditionalDetail:profileDetail
              });
              return res.status(200).json({
                success:true,
                message:"User signup successfully",
                user
              })
        }
        if(accountType==='Seller')
        {
           let sellerDetail=await  SellerProfile.create({
              shopName:null,
              shopCategory:null,
              description:"Welcome guys to E-shop"
           })
           const user=await User.create({
            name,email,password:hashpassword,accountType,confirmation,
            selleradditionalDetail:sellerDetail
           })
           return res.status(200).json({
            success:true,
            message:"User signup successfully",
            user
          })
        }

        
          
    } catch (error) {

        console.log(error);
        return res.status(505).json({
            success:false,
            message:"user are not able to signup "
        })
    }
}

// login for user
exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
    // validate the user credentials
    if(!email || !password)
    {
        return res.status(404).json({
            success:false,
            message:"user data not fetched correctly"
        })
    }
    // check userExistence
    const userExistence=await User.findOne({email}).populate({
        path:"useradditionalDetail",
        model:"UserProfile"
    }).populate({
        path: "selleradditionalDetail",
        model: "SellerProfile",
      });
    if(!userExistence)
    {
        return res.status(404).json(
            {
                success:false,
                message:"User not registered"
            })
    }
    
    if(await bcrypt.compare(password,userExistence.password))
    {
        // generate jwt token
        const payload={
            email:userExistence.email,
            name:userExistence.name,
            accountType:userExistence.accountType,
            _id:userExistence._id
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"3h"
        });
        userExistence.token=token;
    
        await userExistence.save();
        userExistence.password=undefined;
        
        const options={
            expiresIn:new Date(Date.now()*3*24*60*60*1000),
            httpOnly:true
        }
        return res.cookie("token",token,options).status(200).json({
            success:true,
            message:"user logged in successfully",
            token,
            userExistence
        })
    }
    } catch (error) {
        console.log(error);
        return res.status(505).json({
            success:false,
            message:"error in login page"
        })
    }
}

// change password
exports.changePassword=async(req,res)=>{
    // get data from the user
    const {email,oldpassword,newPassword,confirmNewPassword}=req.body;
    // validate karo user ko
    if(!email || !oldpassword)
    {
        return res.status(403).json(
                {
                    success:false,
                    message:"all field are required"
                }
            )
    }
    // fetch oldpassword , new Password , confirm password
    const checkUser=await User.findOne({email:email,password:oldpassword});
    if(!checkUser)
    {
        return res.status(404).json({
            success:false,
            message:"Password incorrect ---> for change password block"
        })
    }
    // update new password in db
    if(newPassword!=confirmNewPassword)
    {
        return res.status(400).json(
                {
                    success:false,
                    message:"Password && confirm Password are not matching"
                }
            )
    }
    checkUser.password=newPassword;
    await checkUser.save();
    // send mail --> email 
    const body=`<h2>Dear user,</h2>
     <p>Your password has been updating</p>
     <h4>if these not you , so mail to our support urgently</h4>

     <h2> your regards,</h2>
     <h3>Study Notion</h3>
    `
    await sendEmail.mailSender(email,"password update Notification",body);
    
    // return response
    return res.status(200).json(
        {
            success:true,
            message:"mail sent successfully"
        }
    )
}