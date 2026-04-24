const mongoose =require("mongoose");
const {Schema} =require("mongoose");

const ticketSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  description :{
    type:String,
    required:true
  },
  category:{
    type:String,
    enum:["software","hardware","network","finance","hr","general"],
    required:true
  },
  status:{
     type: String,
    enum: ["Pending", "In Progress", "Resolved", "Closed"],
    default: "Pending"
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  // assignedTo:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:"User",
  //   default:null
  // },
   comments: [
    {
      text: {
        type: String,
        required: true,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);