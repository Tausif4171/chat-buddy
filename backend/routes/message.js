// messages.js (new route file)
const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

// Get messages between two users
router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 }); // Sort messages by timestamp

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Save a message
router.post("/", async (req, res) => {
  const { sender, receiver, content } = req.body;

  try {
    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
