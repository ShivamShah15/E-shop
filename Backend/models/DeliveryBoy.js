const mongoose=require('mongoose');

const DeliveryBoySchema=new mongoose.Schema({ 
    useremail:{
        type:String,
        required:true,
        trim:true
    },
    accountType:{
        type:String
    }
});

module.exports=mongoose.model("DeliveryBoy",DeliveryBoySchema);


 // "server": "cd server && npm run dev",
    // "dev": "concurrently -n \"client,server\" -c \"bgBlue,bgYellow\" \"npm start\" \"npm run server\""