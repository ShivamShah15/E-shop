const {sellerSellingSchema}=require("../models/sellerSellingProfile");

// const sellerSellingSchema = require('../path/to/sellerSellingSchema');

exports.getallsoldproduct = async (req, res) => {
  try {
    const sellerId=req.query.sellerId;
    console.log(sellerId);

    // validate the sellerId if needed
    // if (!sellerId) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "All fields required",
    //   });
    // }

    const sellerSellingDetail = await sellerSellingSchema.find({ sellerId });
    console.log(sellerSellingDetail);
    const soldSellerDetail=sellerSellingDetail[0].allSellDetails.filter((items)=> items.productStatus === "Success");
    

    return res.status(200).json({
      success: true,
      message: 'Sold products retrieved successfully',
      soldSellerDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error while fetching all sold products',
    });
  }
};
