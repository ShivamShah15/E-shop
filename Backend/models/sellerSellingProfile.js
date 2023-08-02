const mongoose=require("mongoose");
const EachSell=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    contactNumber:{
        type:Number,
    },
   productName:{
                type:String,
            },
    productId:{
         type:String,
    },
    shopName:{
        type:String,
        required:true
    },
    productStatus:{
        type:String,
        default:"Waiting"
    }
})

const sellerSellingSchema=new mongoose.Schema({
      sellerId:{
        type:String,
        required:true
      },
      allSellDetails:[EachSell]
    
})

module.exports = {
    EachSell: mongoose.model("EachSell", EachSell),
    sellerSellingSchema: mongoose.model("sellerSellingSchema", sellerSellingSchema),
  };