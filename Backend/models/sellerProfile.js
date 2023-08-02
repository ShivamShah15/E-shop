const mongoose=require('mongoose');

const sellerprofileSchema=new mongoose.Schema({
    shopName:{
        type:String,
    },
    shopCategory:{
        type:String,
    },
    description:{
        type:String,
    },
    sellerSellingProfile:{
        type:mongoose.Schema.Types.Object,
        ref:"sellerSellingProfile"
    }

});

module.exports=mongoose.model("SellerProfile",sellerprofileSchema);