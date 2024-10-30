const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const WebSocket = require("ws");
const userRoutes = require("./routes/user");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

// WebSocket handling
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // Broadcast message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
