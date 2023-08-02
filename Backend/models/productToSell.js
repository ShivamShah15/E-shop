const mongoose=require("mongoose");
const productToSellSchema=new mongoose.Schema({
    allProducts:[
            {
                type:mongoose.Schema.Types.Mixed,
                ref:"products"
            }
     ]
})

module.exports=mongoose.model("SellerProductDetails",productToSellSchema);