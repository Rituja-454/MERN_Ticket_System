const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken =(user)=>{
  return jwt.sign(
    {
      id:user._id ,
      role:user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"1d"  
    }
  );
};

const registerUser = async(req , res)=>{
    try{
        const {name , email , password} = req.body;

        // 2. Validate input
      if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory required" });
    }

        // Check if user already exists

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        } 

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role:"employee"
        });

        res.status(201).json({message:"User registered successfully" ,user:{
          id:user._id,
          name:user.name,
          email:user.email,
          role:user.role,
        },
        token:generateToken(user),
      });
    } 
    catch (error) {
       console.log(error);
        res.status(500).json({message:"Server error"});

    }
};

const loginUser = async(req , res)=>{
    try{
        const {email , password} = req.body;

        // 2. Validate input
        if (!email || !password) {
          console.log("Email or password missing");
          return res.status(400).json({ message: "All fields must be required" });
        }

        // Check if user exists
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        // 5. Send response with token
        res.json({
          message: "Login successful",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token: generateToken(user),
        });
    }
    catch(error){
      console.log(error);
        res.status(500).json({message:"Server error"});
    }
}

const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};