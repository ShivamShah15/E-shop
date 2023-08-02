const User=require("../models/User");
const SellerProfile=require("../models/sellerProfile")

// getshop
exports.getshop=async(req,res)=>{
   try {
     //we get shop_id from middlewares
     const shop_id=req.user._id;

     const shopDetails=await User.findById({_id:shop_id},{
         password:0,confirmation:0,accountType:0,
     }).populate({
        path:'selleradditionalDetail',
        model:'SellerProfile'
     });
     // check shop is exist or not
     if(!shopDetails)
     {
         return res.status(404).json({
             success:false,
             message:"you are not creating a shop"
         })
     }
     // return shop details to frontend
     res.status(200).json({
         success: true,
         shopDetails,
       });
   } catch (error) {
      return res.status(505).json({
        success:false,
        message:error.message
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
        await SellerProfile.findByIdAndDelete({_id:UserDetails.selleradditionalDetail});
        // delete user
        await User.findByIdAndDelete({_id:_id});
    } catch (error) {
        return res.status(505).json({
            success:false,
            message:"we are not able to delete this account"
        })
    }
}


// logout from shop
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
        return next(new ErrorHandler(error.message, 500));
      }
}