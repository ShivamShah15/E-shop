const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  purchasingDate: {
    type: Date,
    default: Date.now,
  },
  orderStatus:{
    type:String,
    default:"Waiting"
  }
});

const ProductDetailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  allProducts: [purchaseSchema],
});

module.exports = {
  Purchase: mongoose.model("EachProduct", purchaseSchema),
  ProductDetail: mongoose.model("UserProductDetails", ProductDetailSchema),
};
