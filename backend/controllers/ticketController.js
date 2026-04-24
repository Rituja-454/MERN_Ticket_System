const Ticket =require('../models/Ticket');

// Create a new ticket
const createTicket = async(req , res)=>{
    try{
        const {title , description,category} = req.body;

        // Validate input
        if(!title || !description || !category){
            return res.status(400).json({message:"All fields are required"});
        }

        const ticket = await Ticket.create({
            title,
            description,
            category:category.toLowerCase(),
            createdBy:req.user.id
        });

        res.status(201).json({message:"Ticket created successfully" , ticket});

    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Server error"});
     }
};

// Get all tickets for the logged-in user
const getTickets = async(req , res)=>{
    try{
      let tickets;
      if(req.user.role === "admin"){
        tickets = await Ticket.find().populate('createdBy' , 'name email')
                   .sort({ createdAt: -1 });
      } else {
        tickets = await Ticket.find({createdBy:req.user.id})
                   .populate("createdBy", "name email")
                   .sort({ createdAt: -1 });
      }       
      res.status(200).json({tickets});
    }
     catch(error){
        console.log(error);
        res.status(500).json({message:"Server error"});

    }
};

// Get a single ticket by ID
const getTicketById = async(req , res)=>{
    try{
      const ticket = await Ticket.findById(req.params.id).populate('createdBy' , 'name email')
      .populate("comments.createdBy" , "name email");

      if(!ticket){
        return res.status(404).json({message:"Ticket not found"});
      }

     // employee restrictions
     if(req.user.role!=="admin" && 
      ticket.createdBy._id.toString() !== req.user.id.toString()){
        return res.status(403).json({message:"Access denied"});
      }
      res.status(200).json({ticket});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Server error"});
    }
}

// Update a ticket
const updateTicketStatus = async(req,res)=>{
  try{
    if(req.user.role !== "admin"){
      return res.status(403).json({message:"Access denied , Admin only"});
    }
    const {status} = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
      return res.status(404).json({message:"Ticket not found"});
    }
    ticket.status = status || ticket.status;

    const updatedTicket = await ticket.save();
    res.status(200).json({message:"Ticket updated successfully" , ticket:updatedTicket});
  }
  catch(error){
    console.log("Update Status Error: ",error);
    res.status(500).json({message:"Server error"});
  }
};

// Add a comment to a ticket
const addComment = async(req,res)=>{
  try{
      const ticket = await Ticket.findById(req.params.id);

      if(!ticket){
        return res.status(404).json({message:"Ticket not found"});
      }

      ticket.comments.push({
        text:req.body.text,
        creaqtedBy:req.user._id,
      })

      await ticket.save();
      res.status(200).json({message:"Comment added successfully"});
  }
  catch(error){
    console.log("Add Comment Error: ",error);
    res.status(500).json({message:"Server error"});
  }
};

// Delete a ticket
const deleteTicket = async(req,res)=>{
  try{
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
      return res.status(404).json({message:"Ticket not found"});
    }

    // employee restrictions
    if(req.user.role!=="admin" && 
      ticket.createdBy._id.toString() !== req.user.id.toString()){
        return res.status(403).json({message:"Access denied"});
      }

    await ticket.remove();
    res.status(200).json({message:"Ticket deleted successfully"});

  }
  catch(error){
    console.log("Delete Ticket Error: ",error);
    res.status(500).json({message:"Server error"});
  }
};

module.exports = {
    createTicket,
    getTickets,
    getTicketById,
    updateTicketStatus,
    addComment,
    deleteTicket
};