const DeliveryBoy=require("../models/DeliveryBoy");
const User=require("../models/User");
const {ProductDetail}=require("../models/userProductDetail")
const {Purchase}=require("../models/userProductDetail")
const {sellerSellingSchema}=require("../models/sellerSellingProfile")
const OTP=require("../models/SendOTP")
const SellerProfile=require("../models/sellerProfile")
const SellerDetails=require("../models/User");
// const sellerProfile = require("../models/sellerProfile");
const createOTP=require("otp-generator");

exports.sendotp=async(req,res)=>{

    try {
      // fetch email from frontend
      const email=req.body.email;
      // check email is already present in db or not
      console.log(email)
      const checkUser=await User.findOne({email});
      if(!checkUser)
      {
         return res.status(404).json({
          success:"false",
          message:"User not exists"
         })
      }

    //   "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoaXZhbXNoYWgxNTE1QGdtYWlsLmNvbSIsIm5hbWUiOiJUYXJ1biBEdWJleSIsImFjY291bnRUeXBlIjoiVXNlciIsIl9pZCI6IjY0YjMxMjI5OTNhYTZhZjZlOGNlMTlmYSIsImlhdCI6MTY4OTc3MDE4OCwiZXhwIjoxNjg5NzgwOTg4fQ.NxAFYi0ZX_ARJcBurS3gnoIFyPQeS5kWuqOJSl4dOjw"

    const EachUserAllProductDetails =await ProductDetail.findOne({email});
    // hum abhi esa mann ke chal rahe ki yadi delivery boy aya hai toh vo user ke order hue 
    // product user ko de rahah hai
    console.log(EachUserAllProductDetails)
    const WaitingProductArray=[];
    const myProduct=EachUserAllProductDetails.allProducts;
    myProduct.map((item,index)=>{
        if(item.orderStatus === "Waiting")
        WaitingProductArray.push(item);
    })

     // humare pass har ek waiting product ki detail aa gye
     // validate the WaitingProductArray
     if(!WaitingProductArray)
     {
        return res.status(404).json({
            success:false,
           message:"no Delivery possible, because user not buy any product"
        })
     }
      // now generate an otp
      var otp=createOTP.generate(6,{
           upperCaseAlphabets:false,
           lowerCaseAlphabets:false,
           specialChars:false
      })
  
      // check otp  unique hai ya nahi ----> bahut ganda tareeka hai db me otp check karna
      const result=await OTP.findOne({otp:otp});
      while(result)
      {
          var otp=createOTP.generate(6,{
              upperCaseAlphabets:false,
              lowerCaseAlphabets:false,
              specialChars:false
         }) 
         result=await OTP.findOne({otp:otp});
      }
      // now hame pta hai hamari otp unique hai toh ham isse database me store karenge
      const otpPayload={email:email,otp:otp};
      // jab me document create karunga toh uss pehle pre(save) wala function chalega jisse user
     //  ke mobile me otp send hoga
      const otpBody=await OTP.create(otpPayload);
      console.log(otpBody);
  
      // return response
      res.status(200).json({
          success:true,
          message:"OTP sent successfully",
      });
  
    } catch (error) {
     console.log(error);
     res.status(505).json(
         {
             success:false,
             message:"error in sendotp"
         }
     )
    }
     
 }

 exports.verifyUser = async (req, res) => {
    try {
      const { otp, token } = req.body;
      if (!otp || !token) {
        return res.status(404).json({
          success: false,
          message: "otp is not get from user",
        });
      }
  
      const userDetails = await User.findOne( {token} );
     console.log(userDetails);
      const email = userDetails.email;
  
      const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
      console.log(response);
      if (response.length === 0) {
        // OTP not found for the email
        return res.status(400).json({
          success: false,
          message: "otp not found",
        });
      } else if (otp !== response[0].otp) {
        // Invalid OTP
        return res.status(400).json({
          success: false,
          message: "The OTP is not valid",
        });
      }
  
      // now update the user order status
      // we assume if the user enters otp, it means the user gets their product
      const EachUserAllProductDetails = await ProductDetail.findOne({ email });
      // console.log(EachUserAllProductDetails);
      EachUserAllProductDetails.allProducts.map((item, index) => {
        if (item.orderStatus === "Waiting") {
          item.orderStatus = "Success";
        }
      });
  
      // Save the updated EachUserAllProductDetails document
      await EachUserAllProductDetails.save();
      console.log(EachUserAllProductDetails);
  
      const SellerProfileDetails = await SellerProfile.findOne({
        shopName: EachUserAllProductDetails.allProducts[0].shopName,
      });
    
      if (!SellerProfileDetails) {
        return res.status(400).json({
          success: false,
          message: "Seller profile not found",
        });
      }
    
      console.log(SellerProfileDetails);
    
      // const SellerDetailed = await SellerDetails.findById(SellerProfileDetails._id);
      // console.log(SellerDetailed)
      // if (!SellerDetailed) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Seller details not found",
      //   });
      // }
    
      // console.log(SellerDetailed);
    
      // const sellerProfileDetails = await SellerProfile.findById(SellerProfileDetails._id);
      const sellerId = SellerProfileDetails._id.toString();


// yaha se karna hai
const sellerSellingDetailed = await sellerSellingSchema.findOne({sellerId});

if (!sellerSellingDetailed) {
  return res.status(400).json({
    success: false,
    message: "Seller selling details not found",
  });
}
console.log(sellerSellingDetailed);

sellerSellingDetailed.allSellDetails.map((item, index) => {
  if (item.productStatus === "Waiting") {
    item.productStatus = "Success";
  }
});

// Save the updated sellerSellingSchema document
await sellerSellingDetailed.save();

    
      console.log(sellerSellingDetailed);
    
      return res.status(201).json({
        success: true,
        message: "verify and update the user and seller",
      });
    } catch (error) {
      console.log(error);
      return res.status(502).json({
        success: false,
        message: "we got an error while verifying the user",
      });
    }}