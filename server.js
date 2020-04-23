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

  socket.on("callUser", data => {
    console.log('in callUser', data.signalData)
    io.to(data.userToCall).emit('hey', {
      signal: data.signalData
    })
  })

  socket.on('acceptCall', data => {
    io.to(data.to).emit("callAccepted", data.signal)
  })
});

server.listen(8001, () => console.log("server is running on port  8001"));
