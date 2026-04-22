//const mongoose =require('mongoose');
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
connectDB();
const app=express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/api/test",(req,res)=>{
  res.send("API is working");
 // res.send ("backend is connected to frontend");
  //res.json({message:"backend is connected to frontend"});
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})