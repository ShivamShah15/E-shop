const express=require("express");
const app=express();

const userRoutes=require('./routes/User');
const sellerRoutes=require('./routes/seller');
const deliveryRoutes=require("./routes/delivery");

const database=require("./config/database");
const cookieParser=require('cookie-parser');
const cors=require('cors');
const dotenv=require('dotenv');

dotenv.config();
const PORT=process.env.PORT  || 4000;

// database connect
database.connect();
// middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/seller",sellerRoutes);
app.use("/api/v1/deliveryboy",deliveryRoutes);

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:`Your server is running at the Port ${PORT}`
    });
})

app.listen(PORT,()=>{
    console.log(`App is running at the port of ${PORT}`);
})