const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
     name:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     password:{
        type:String,
        required:true,
        minlength:[6]
     },
     confirmation:{
        type:Boolean,
        required:true
     },
     useradditionalDetail:{
        type:mongoose.Schema.Types.ObjectId,
        ref:function()
        {
         if(this.accountType==='User')
         return "userProfile"
        }
     },
     selleradditionalDetail:{
      type:mongoose.Schema.Types.ObjectId,
      ref:function()
      {
        if(this.accountType==='Seller')
        return "sellerProfile";
      }
     },
     token:{
      type:String
     },
     accountType:{
      type:String,
      enum:["Admin","User","Seller"],
      required:true
     },
     productDetails:{
      type:mongoose.Schema.Types.Mixed,
      ref:function()
      {
         if(this.accountType==='User')
         return "productDetails";
      }
   },
    productToSell:{
      type:mongoose.Schema.Types.Mixed,
      ref:function()
      {
          if(this.accountType==='Seller')
          return "productToSell"
      }
    }
})

module.exports=mongoose.model("User",userSchema);
