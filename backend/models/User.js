const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const userSchema = new Schema({
  name :{
    type:String,
    required:true
  },
  email :{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:["employee",'admin'],
    default:"employee"
  },
  isActive:{
    type:Boolean,
    default:true
  }
}, {timestamps:true});

module.exports = mongoose.model("User", userSchema);