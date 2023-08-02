const User=require("../models/User");
const { ProductDetail, Purchase } = require("../models/userProductDetail");
const {Products} =require("../models/products")
const {sellerSellingSchema,EachSell}=require('../models/sellerSellingProfile')
const SellerProfile=require("../models/sellerProfile")

exports.purchaseNew = async (req, res) => {
  try {
    // Get userId and productDetails
    const { productName, productPrice, shopName, orderStatus } = req.body;
    const userId = req.user._id;
    // const userId = "64ba81dd22d6df05cac179a9";

    // Fetch UserObject through userId
    const userDetails = await User.findById(userId);

    // Validate
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const purchase = new Purchase({
      productName,
      productPrice,
      shopName,
      orderStatus,
    });

    const userProductDetails = await ProductDetail.findOne({ email: userDetails.email });
    if (userProductDetails) {
      userProductDetails.allProducts.push(purchase);
      await userProductDetails.save();

      const EachSellDetails = await EachSell.create({
        userName: userDetails.name,
        userId: userDetails._id,
        email: userDetails.email,
        // contactNumber: userDetails.useradditionalDetail.contactNumber,
        productDetail: purchase.productName,
        productId: purchase._id,
        shopName: purchase.shopName,
        productStatus: purchase.orderStatus,
      });
      const sellerDetailed = await SellerProfile.findOne({shopName});
      // console.log(sellerId);
      let sellerDetails = await sellerSellingSchema.findOne(sellerDetailed._id );
      const sellerId=sellerDetailed._id;
      if (!sellerDetails) {
        // Find sellerId based on the shopName
        const sellerProfile = await SellerProfile.findOne({ shopName });
        if (!sellerProfile) {
          return res.status(404).json({
            success: false,
            message: "Seller not found for the provided shopName",
          });
        }
        

        sellerDetails = new sellerSellingSchema({
          shopName,
          sellerId,
          allSellDetails: [EachSellDetails],
        });
      } else {
        sellerDetails.allSellDetails.push(EachSellDetails);
      }

      await sellerDetails.save();
    } else {
      const newUserProductDetails = new ProductDetail({
        email: userDetails.email,
        allProducts: [purchase],
      });
      await newUserProductDetails.save();

      const EachSellDetails = await EachSell.create({
        userName: userDetails.name,
        userId: userDetails._id,
        email: userDetails.email,
        contactNumber: userDetails.useradditionalDetail.contactNumber,
        productDetail: purchase.productName,
        productId: purchase._id,
        shopName: purchase.shopName,
        productStatus: purchase.orderStatus,
      });

      let sellerDetails = await sellerSellingSchema.findOne({ shopName });
      if (!sellerDetails) {
        // Find sellerId based on the shopName
        const sellerProfile = await SellerProfile.findOne({ shopName });
        if (!sellerProfile) {
          return res.status(404).json({
            success: false,
            message: "Seller not found for the provided shopName",
          });
        }
        const sellerId = sellerProfile._id;

        sellerDetails = new sellerSellingSchema({
          shopName,
          sellerId,
          allSellDetails: [EachSellDetails],
        });
      } else {
        sellerDetails.allSellDetails.push(EachSellDetails);
      }

      await sellerDetails.save();
    }

    return res.status(200).json({
      success: true,
      message: "New purchase product added to the database",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in purchase new",
    });
  }
};


// sare buyproduct related to one user
exports.getuserbuyProduct = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user._id);
    
    if (userDetails.accountType === 'User') {
      const productDetails = await ProductDetail.find({ email: userDetails.email });
      
      const allProducts = productDetails.map((productDetail) => {
        return productDetail.allProducts;
      });

      return res.status(200).json({
        success: true,
        message: "Successfully fetched all products",
        allProducts: allProducts.flat(),
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "You are not a User or admin, so you can't see all products on the website",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching all products from the database",
    });
  }
};