const express=require("express");
const router=express.Router();

const {auth,isSeller}=require('../middleswares/auth');
const {getshop,deleteAccount,logout}=require("../controller/ShopProfile");
const {createProduct,getAllShopProducts,deleteAnyProducts}=require("../controller/product");
const {updateSellerProfile}=require("../controller/updateSeller");
const {getallsoldproduct}=require("../controller/getallsoldproduct.js")
const {getAllProducts}=require("../controller/product");
router.get("/getshop",auth,getshop);
router.post("/createProduct",auth,isSeller,createProduct);
router.get(`/getallshopProduct`,auth,getAllShopProducts);
router.get("/allProduct",getAllProducts);
// deleteProduct get an error
router.post(`/deleteProduct/:id`,auth,deleteAnyProducts);
router.put("/updateseller",updateSellerProfile);
router.get("/getallsoldproduct",auth,getallsoldproduct);

module.exports=router;

