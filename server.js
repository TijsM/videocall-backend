const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};

io.on("connection", (socket) => {
  socket.emit("yourSocketId", socket.id);
  socket.emit("users", users)

  socket.on('setOwnerId', (id) => {
    console.log("in set owner id", id)
    users.ownerId = id;

    io.sockets.emit('ownerOnline', id)
  })

  socket.on('setVisitorId', (id) => {
    console.log("in set visitor id", id)
    users.visitorId = id;

    io.sockets.emit('visitorOnline', id)
  })

});

server.listen(8000, () => console.log("server is running on port  8000"));
