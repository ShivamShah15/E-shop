const nodemailer=require("nodemailer");

const mailSender=async(email,title)=>{
    try {
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
         
        if(!email || email.trim()==='')
        {
            console.error("Invalid or empty email");
            return;
        }
        let info=await transporter.sendMail(
            {
                from:`E-shop || shivam shah`,
                to:`${email}`,
                subject:`${title}`,
                html:`<p>sir i get a request from your site to sign in E-shop Website , if is Your then ignore these message and fill sign up form and do credentials 'Yes' </p>`
            }
        )
        // res.status(200).json({
        //     success:true,
        //     message:"we send mail to the user successfully"
        // })

    } catch (error) {
        console.log(error);
        console.log("we got an error in sending email");
        
    }
}

module.exports=mailSender;