const express = require('express');
const router = express.Router();

const {createTicket , getTickets , getTicketById ,updateTicketStatus , addComment , deleteTicket} = require("../controllers/ticketController");
const {protect} = require("../middleware/authMiddleware");

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/:id", protect, getTicketById);
router.put("/:id/status", protect, updateTicketStatus);
router.post("/:id/comment", protect, addComment);
router.delete("/:id", protect, deleteTicket);

module.exports = router;