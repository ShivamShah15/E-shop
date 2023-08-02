// const sellerSellingProfile = require('../models/sellerSellingProfile');
const {sellerSellingDetails,eachSellDetails}=require('../models/sellerSellingProfile')
const User=require("../models/User")
exports.updateSellingDetails=async(req,res)=>{
    try {
        const {userId,productDetail}=req.body;
        // validate the details
        if(!userId || !productDetail)
        {
            return res.status(404).json({
                success:false,
                message:"all fields are required"
            })
        }

        // now we get userDetails
        const userDetails=await User.findbyId({userId});
       const EachSellDetails= await eachSellDetails.create({
            userName:userDetails.name,userId:userDetails._id,email:userDetails.email,
            contactNumber:userDetails.useradditionalDetail.contactNumber,productDetail:productDetail
        });

        const sellerSellingDetails = await sellerSellingDetails.findOne({ sellerId:productDetail.sellerId });

        if (sellerSellingDetails) {
            sellerSellingDetails.allSellDetails.push(EachSellDetails);
          await sellerSellingDetails.save();
        } else {
          const newsellerSellingDetails = new sellerSellingDetails({
            sellerId: productDetail.sellerId,
            allProducts: [EachSellDetails]
          });
          await newsellerSellingDetails.save();
        }
    
        return res.status(200).json({
          success: true,
          message: " product added to the database"
        });
        
    } catch (error) {
        console.log(error);
        return res.status(505).json({
            success:false,
            message:"we get error in sellerselling page"
        })
    }
}