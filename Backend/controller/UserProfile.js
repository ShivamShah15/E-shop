const User=require("../models/User")
const UserProfile=require("../models/userProfile")
const bcrypt=require("bcryptjs")

// getuser
exports.getUser=async(req,res)=>{
    try {
      //we get shop_id from middlewares
      const user_id=req.user._id;
 
      const userDetails=await User.findById(user_id,{
          password:0,confirmation:0,accountType:0,
      }).populate( {
         path:'useradditionalDetail',
         model:'UserProfile'
    });
      // check shop is exist or not
      if(!userDetails)
      {
          return res.status(404).json({
              success:false,
              message:"you are not creating a shop"
          })
      }
      // return shop details to frontend
      res.status(200).json({
          success: true,
          userDetails,
        });
    } catch (error) {
        console.log(error);
       return res.status(505).json({
         success:false,
         message:"get user not working"
       })
     }
 }

 // delete  shop
exports.deleteAccount=async(req,res)=>{
    try {
        // fetch user id
        const {_id}=req.body;
        // validate
        if(!_id)
        {
            return res.status(404).json({
                success:false,
                message:"all field are required"
            })
        }
        // check user is present in db or not
        const UserDetails=await User.findById(_id);
        if(!UserDetails)
        {
            return res.status(404).json(
                {
                    success:false,
                    message:"User not found"
                }
            )
        }
        // HW: Chron JOb and Job Scheduling
        // delete additional detail before deleting profile
        await UserProfile.findByIdAndDelete({_id:UserDetails.useradditionalDetail});
        // delete user
        await User.findByIdAndDelete({_id:_id});
    } catch (error) {
        return res.status(505).json({
            success:false,
            message:"we are not able to delete this account"
        })
    }
}


exports.logout=async(req,res)=>{
    try {
        res.cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
        });
        res.status(201).json({
          success: true,
          message: "Log out successful!",
        });
      } catch (error) {
        return res.status(505).json({
            success:false,
            message:"error in logged out"
        })
      }
}

exports.updateProfile=async(req,res)=>{
    try {
        const {gender,dateOfBirth,about,contactNumber}=req.body;
        
        // we are not doing validation because it user choice
        // which data they want to give
        
        console.log(req.user);
        const userId=req.user._id;
        const user=await User.findById(userId);
        const dateOfBirthString = new Date(Date.parse(dateOfBirth));
        let updatedValue;
        if(user.accountType==="User")
         updatedValue=await UserProfile.findByIdAndUpdate(user.useradditionalDetail._id,{gender,dateOfBirthString,about,contactNumber},{new:true});
        else
        updatedValue=await User.Profile.findByIdAndUpdate(user.selleradditionalDetial._id,{gender,dateOfBirthString,about,contactNumber},{new:true});
        console.log(updatedValue)
        return res.status(201).json({
            success:true,
            message:"user updated successfully",
            updatedValue
        })
        
    } catch (error) {
        console.log(error);
        return res.status(505).json({
            success:false,
            message:"we get error in update user"
        })
    }
}


exports.changepassword=async(req,res)=>{
    try {
        // get data
    const {NewPassword,ConfirmPassword,token}=req.body;
    // const token=req.user;
    console.log(token);
    console.log(NewPassword);
    console.log(ConfirmPassword);
    // validation of data
    if(!NewPassword || !ConfirmPassword || !token)
    {
        return res.status(404).json(
            {
                success:false,
                message:"All fields are required"
            }
        )
    }
    if(NewPassword!==ConfirmPassword)
    {
        return res.status(404).json(
            {
                success:false,
                message:"password and confirmpassword are not matching"
            }
        )
    }
    // with the help of token find user in database
    const userDetail=await User.findOne({token:token});
    if(!userDetail)
    {
        console.log(userDetail);
        return res.status(404).json(
            {
                success:false,
                message:"Invalid user"
            }
        )
    }
    // if no entry found or token expires then return an error response
    if(userDetail.expiresDetail< Date.now())
    {
        return res.status(404).json({
            success:false,
            message:" Token is invalid bcoz token expires"
        })
    }
    // compare password and hash it
    const hashedPassword=bcrypt.hash(NewPassword,10);
    // return response
    return res.status(201).json({
        success:true,
        message:"password update successfully"
    })
    } catch (error) {
        console.log(error);
        return res.status(505).json(
        {
            success:false,
            message:"error in reset password"
        }
        )
    }
}