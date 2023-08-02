// controllers/sellerProfileController.js

const SellerProfile = require('../models/sellerProfile');

exports.updateSellerProfile = async (req, res) => {
  try {
    const { shopName, shopCategory, description } = req.body;
    // abhi body se id de do bad me badal denge
    const sellerId = req.body._id; // Assuming you have authenticated the request and have access to the seller's ID.

    // Validate the required fields
    if (!shopName || !shopCategory || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields (shopName, shopCategory, and description) are required.",
      });
    }

    // Find the seller profile in the database
    const sellerProfile = await SellerProfile.findById(sellerId);

    if (!sellerProfile) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found.",
      });
    }

    // Update the seller profile fields
    sellerProfile.shopName = shopName;
    sellerProfile.shopCategory = shopCategory;
    sellerProfile.description = description;

    // Save the updated seller profile
    await sellerProfile.save();

    return res.status(200).json({
      success: true,
      message: "Seller profile updated successfully.",
      data: sellerProfile, // You can choose to send the updated profile back in the response if needed.
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating seller profile.",
    });
  }
};
