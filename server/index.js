const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { corsAccessControl } = require("./routes/condigRoutes");
require("dotenv").config();

app.use(cors());
const server = http.createServer(app);

corsAccessControl(app);
//connet out server with socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, //telling our server which server is going to be calling to our socket.io server, the client side
    methods: ["GET", "POST"], // methods allowed
  },
});
// const io = require("socket.io")(3000);
//on is listening to an event
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID ${socket.id} joined room ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log("sent");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

const port = process.env.PORT || 3002;

server.listen(port, () => {
  console.log("server running on port " + port);
});
