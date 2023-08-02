const express=require("express");
const router=express.Router();

// Import all the controller 
const {login,signup,sendmail,changePassword}=require("../controller/auth.js");

const {purchaseNew,getuserbuyProduct}=require("../controller/userbuyProduct.js");
const {getUser,deleteAccount,logout, updateProfile, changepassword}=require("../controller/UserProfile.js");
const {auth,isConsumer}=require('../middleswares/auth');

// ******************************************************************************************************************************
// ******************************************  USER CREDENTIALS  ****************************************************************
// ******************************************************************************************************************************
// Route for user login
router.post("/login",login);

// Route for user signup
router.post("/signup",signup);

// Route for user sendmail
router.post("/sendmail",sendmail);

// Route for user changePassword  --> we need auth middleware to verify it is our user or not
router.post("/changepassword",auth,changepassword);

// *******************************************************************************************************************************
// ******************************************* PRODUCT DETAILS **********************************************************************
// *******************************************************************************************************************************
router.get("/getuserbuyproduct",auth,getuserbuyProduct);
router.post("/purchasenew",auth,purchaseNew);
router.get("/getuser",auth,getUser);
router.post("/deleteprofile",auth,deleteAccount);
router.post("/logout",auth,logout);
router.put("/updateProfile",auth,updateProfile);






module.exports=router
