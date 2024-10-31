const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const Message = require("./models/Message"); // Ensure this path is correct

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL if different
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Socket.IO handling
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", async (message) => {
    // Save message to the database
    const { sender, receiver, content } = message;
    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();

    // Send message to the intended receiver
    io.to(receiver).emit("message", newMessage); // Emit to specific receiver
    socket.emit("message", newMessage); // Send back to sender for immediate display
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
