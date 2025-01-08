const express = require("express");
const { Server } = require("socket.io");
const http = require("http"); // Required for creating the HTTP server
const cors = require("cors");
const appConfig = require("./app.js");
require("dotenv").config();

// Express app
const app = appConfig.app;

// Create an HTTP server
const httpServer = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend to connect
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Define Socket.IO behavior
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Export io to use it in other modules
app.set("io", io);

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
