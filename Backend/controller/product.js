// const allproductToSell=require("../models/productToSell");
const Product=require("../models/products")
const User=require("../models/User");
const SellerProfile=require("../models/sellerProfile")


// create new product
exports.createProduct=async(req,res)=>{
    try {
      const shopId = req.body.shopId;
      console.log("Shop ID:", shopId);
  
      const shop = await SellerProfile.findById(shopId);
  
      console.log("Shop:", shop);
        if (!shop) {
          console.log(shop);
          return res.status(404).json({
            success:false,
            message:"shop is not defined"
          });
        } else {

          // for testing purpose we make commented
          // const files = req.files;
          // const imageUrls = files.map((file) => `${file.filename}`);
          const allimages=[];
          const productData = req.body.formData;
          allimages.push(req.body.images);
          productData.image_Url=allimages;
        
  
          // Create the new product
      const newProduct = await Product.create(productData);

      // Check if the allproductToSell document exists
      let allProductData = await allproductToSell.findOne();

      if (!allProductData) {
        // Create the allproductToSell document if it doesn't exist
        allProductData = await allproductToSell.create({});
      }

      allProductData.allProducts.push(newProduct); // Add the new product to the allProducts array
      await allProductData.save(); // Save the updated document

          res.status(201).json({
            success: true,
            newProduct,
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(505).json({
          success:false,
          message:"error to create product"
        })
      }
}

// get all products of a  particular shop
exports.getAllShopProducts=async(req,res)=>{
  try {
    const shopName=req.query.shopName;
    // console.log(shopName);
    // console.log(req);
    const AllProducts = await Product.find();
    const requiredProduct=AllProducts.filter((item)=> item.shop.name===shopName);
    // console.log(requiredProduct);
    // console.log(AllProducts);
    res.status(201).json({
      success: true,
      requiredProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(505).json({
      success:false,
      message:"error getallshopProducts"
    })
  }
}
// delete any particular product of a shop

exports.deleteAnyProducts = async (req, res) => {
  try {
    const productId = req.params.id;

    const productData = await Product.findById({_id:productId});
    console.log(productData);

    // Code for deleting associated images (commented out)

    const product = await Product.findByIdAndDelete({_id:productId});

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product for this id not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in delete product",
    });
  }
};

// get all products in website
exports.getAllProducts=async(req,res)=>{
  try {
    const AllProducts = await Product.find().sort({ createdAt: -1 });
  

    res.status(201).json({
      success: true,
      AllProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(505).json({
      success:false,
      message:"we are not able to get allProduct details"
    })
  }
}

