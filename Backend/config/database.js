const mongoose=require('mongoose');
require('dotenv').config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(
        ()=>{
            console.log("Mongodb connected successfully");
        }
    )
    .catch((error)=>{
        console.log("Not connected with Mongodb");
        console.log(error);
        process.exit(1);
    })

};