//const mongoose =require('mongoose');
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const app=express();
app.use(express.json());
app.use(cors());
connectDB();

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/api/test",(req,res)=>{
  res.send("API is working");
 // res.send ("backend is connected to frontend");
  //res.json({message:"backend is connected to frontend"});
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})