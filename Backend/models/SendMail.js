const mongoose=require("mongoose");
const mailSender=require("../utils/mailSender");

const sendmailSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    confirmation:{
        type:Boolean,
        required:true
    }
})
const SendVerificationEmail=async(email)=>{
    try {
        const mailResponse=await mailSender(email,"<h1>Mail from E-shop Website</h1>");
        console.log("email send successfully");  
    } catch (error) {
        console.log("error in sending mail"+email);
        throw error;
    }
}
sendmailSchema.pre('save',async function(next){
    const document=this;
    await SendVerificationEmail(document.email);
    next();
})

module.exports=mongoose.model("sendMail",sendmailSchema);