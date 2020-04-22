const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);


let ownerId;
let visitorId;

io.on('connection', socket => {
  console.log()
   socket.emit("yourSocketId", socket.id);


   socket.on('setOwnerId', (id) => {
     ownerId = id
   })

   socket.on('setVisitorId', (id) => {
     visitorId
   })
  
    socket.emit('getIds',{
      ownerId: ownerId,
      visitorId: visitorId
    })
})

server.listen(8000, () => console.log("server is running on port  8000"));
