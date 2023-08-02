const express=require("express");
const router=express.Router();

const {sendotp,verifyUser}=require("../controller/Delivery");
const {isDelivery}=require('../middleswares/auth');

router.post("/sendotp",isDelivery,sendotp);
router.post("/verifyUser",isDelivery,verifyUser);
module.exports=router;