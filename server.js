const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const push = require("web-push");
const secrets = require("./secrets");
const { firestore } = require("./firebase");

const users = {};

io.on("connection", (socket) => {
  socket.emit("yourSocketId", socket.id);
  socket.emit("users", users);

  socket.on("setOwnerId", (id) => {
    console.log("in set owner id", id);
    users.ownerId = id;

    io.sockets.emit("ownerOnline", id);
  });

  socket.on("setVisitorId", (id) => {
    console.log("in set visitor id", id);
    users.visitorId = id;

    io.sockets.emit("visitorOnline", id);
  });

  socket.on("callUser", (data) => {
    console.log("in callUser", data.signalData);
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

app.post("/sendNotificationToAll", (request, response) => {
  push.setVapidDetails(
    "mailto:tijs.martens.tijs@gmail.com",
    secrets.vapIdKeys.publicKey,
    secrets.vapIdKeys.privateKey
  );

  firestore
    .collection("users")
    .get()
    .then((data) => {
      data.forEach((dat) => {
        const user = dat.data();
        console.log(user);

        if(user.notificationSubscription){
          const sub = JSON.parse(user.notificationSubscription);
          push.sendNotification(sub, "test message");
        }
      });
    });

  response.json("NOTIFICATION WAS SENT");
});

server.listen(8001, () => console.log("server is running on port  8001"));
