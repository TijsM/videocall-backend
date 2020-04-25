const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const push = require("web-push");
const secrets = require("./secrets");

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

app.post("/sendNotification", (request, response) => {

  push.setVapidDetails(
    "mailto:tijs.martens.tijs@gmail.com",
    secrets.vapIdKeys.publicKey,
    secrets.vapIdKeys.privateKey
  );

  // should come from the database
  // this data in sub is coppied from the '    console.log(JSON.stringify(push))      ' line in the frontend
  const sub = {
    endpoint:
      "https://fcm.googleapis.com/fcm/send/c5znBINY_1A:APA91bHXJBjck8vMrA2a80QImRTUxe15TAcCjDT3m3iu3TjIQ7Wy5J0fGo2OLvrCwpIALb2tIKHlk9ibfDUE4Fw5q9OPZyKqAxyRghmZI58hHvmd6Bo7McVmibBKpOr5R9Mei2BF2FFy",
    expirationTime: null,
    keys: {
      p256dh:
        "BDQkRA6xD0aNvqSlvhjdibpV8a10f1fhGw50bAd025pZgYqtBmKSTh95vMLUaXCZE7frhT-PpjZBHBcmZpHVwI4",
      auth: "SgWidN0l8Y5J2PaisRSs-Q",
    },
  };
  push.sendNotification(sub, "test message");


  response.json('NOTIFICATION WAS SENT');

});

server.listen(8001, () => console.log("server is running on port  8001"));
