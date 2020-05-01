const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const push = require("web-push");
const secrets = require("./secrets");
const { firestore } = require("./firebase");
const cors = require("cors");
const bodyParser = require("body-parser");
const prettyFormat = require('pretty-format')

const users = {};

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


io.on("connection", socket => {
  socket.emit("yourSocketId", socket.id);
  socket.emit("users", users);

  socket.on("setOwnerId", data => {
    console.log("in set owner id", data.id);
    
    const roomName = data.roomname;
    const roomOwnerName = data.roomownername;

    if(!users[roomOwnerName]){
      console.log('in if 1')
      users[roomOwnerName] = {}
    }
    if(!users[roomOwnerName][roomName]){
      console.log('in if 1')
      users[roomOwnerName][roomName] = {}
    }
    users[roomOwnerName][roomName].ownerId = data.id

    console.log("users", prettyFormat(users));
    io.sockets.emit("ownerOnline", data.id);
  });

  socket.on("setVisitorId", data => {
    console.log("in set visitorid id", data.id);
    const roomName = data.roomname;
    const roomOwnerName = data.roomownername;

    if(!users[roomOwnerName]){
      console.log('in if 1')
      users[roomOwnerName] = {}
    }
    if(!users[roomOwnerName][roomName]){
      console.log('in if 1')
      users[roomOwnerName][roomName] = {}
    }

    console.log(`users ${roomOwnerName} - ${roomName}`)
    console.log( users[roomOwnerName][roomName])
    users[roomOwnerName][roomName].visitorId = data.id

    console.log("users", prettyFormat(users));

    io.sockets.emit("visitorOnline", data.id);
  });

  socket.on("callUser", data => {
    console.log("in callUser");
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      users
    });
  });

  socket.on("acceptCall", data => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  console.log("end of connection method -  users", prettyFormat(users));
});

app.post("/sendNotificationToAll", (request, response) => {
  push.setVapidDetails(
    "mailto:tijs.martens.tijs@gmail.com",
    secrets.vapIdKeys.publicKey,
    secrets.vapIdKeys.privateKey
  );

  const title = request.body.title;
  const body = request.body.body;

  // console.log(title, body);

  firestore
    .collection("users")
    .get()
    .then((data) => {
      data.forEach((dat) => {
        const user = dat.data();

        if (user.notificationSubscription) {
          const sub = JSON.parse(user.notificationSubscription);
          // console.log(sub);

          // console.log("before sending");
          //the entire notifications can be made here (sub, payload, options)c
          push.sendNotification(
            sub,
            JSON.stringify({
              name: "toAllFromAdmin",
              title,
              body
            })
          );
        }
      });
    });
  response.json("NOTIFICATION WAS SENT");
});

app.post("/sendNotificationEnteredRoom", (request, response) => {
  push.setVapidDetails(
    "mailto:tijs.martens.tijs@gmail.com",
    secrets.vapIdKeys.publicKey,
    secrets.vapIdKeys.privateKey
  );

  const roomOwner = request.body.roomownername;
  const roomName = request.body.roomname;

  // console.log("owner: ", roomOwner);
  // console.log("roomName: ", roomName);

  firestore
    .collection("users")
    .get()
    .then((data) => {
      data.forEach((dat) => {
        const user = dat.data();

        const trimmedUserName = user.userName.split(" ").join("");
        const trimmedRooms = user.rooms.map((room) => {
          return room.split(" ").join("");
        });

        if (roomOwner === trimmedUserName && trimmedRooms.includes(roomName)) {
          if (user.notificationSubscription) {
            const sub = JSON.parse(user.notificationSubscription);

            //the entire notifications can be made here (sub, payload, options)
            push.sendNotification(
              sub,
              JSON.stringify({
                name: "inRoom",
                roomName,
              })
            );
          }
        }
      });
    });
  response.json("NOTIFICATION WAS SENT");
});

server.listen(8000, () => console.log("server is running on port 8000"));
