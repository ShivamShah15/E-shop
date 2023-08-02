const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");

const OTP=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})

const SendVerificationEmail= async (email,otp)=>{
    try {
        const mailResponse=await mailSender(email,"Verification for StudyNotion Website",otp);
        console.log("email send Successfully");
    } catch (error) {
        console.log("error in sending email  "+error);
        throw error;
    }
}

OTP.pre('save',async function(next){
    const document=this;
    console.log("before calling send verification function "+document.email)
    await SendVerificationEmail(document.email,document.otp);
    next();
})

module.exports=mongoose.model("OTP",OTP);