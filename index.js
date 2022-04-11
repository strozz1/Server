const express = require('express');
const req = require('express/lib/request');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { saveMessage, getMessages } = require('./TemporalMsgDB')
const { getUsersFromID } = require('./RoomDataDB')

const usersOnline = new Map()



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('User connected, waiting for login');
  socket.on('login', (user, password, callback) => {
    console.log('User logged in=> ', user, ":", password)
    usersOnline.set(user, socket)
    callback({
      code: "200"
    })
    getPendingMessages(user)
    socket.on('message', (msg) => {
      console.log("new meesage in")
      var obj = JSON.parse(msg)
      if (obj.type == "message") {
        var username = obj.content.username
        sendMessage(username, obj)
      }
      if (obj.type == "group-message") {
        var users = getGroupUsers(obj.content.id)
        for (let index = 0; index < users.length; index++) {
          const user = users[index];
          sendMessage(user,obj)
        }
      }

    })
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

async function getPendingMessages(user) {
  var docs = await getMessages(user)
  var socket = usersOnline.get(user)
  for (var i = 0; i < docs.length; i++) {
    console.log('message send to ' + user);
    socket.emit("message", docs[i])
  }
}

async function getGroupUsers(id) {
  var user_list = await getUsersFromID(id)
  return user_list;


}

function sendMessage(username, message) {
  var userSocket = usersOnline.get(username)
  if (userSocket != null) {
    userSocket.emit("message", message)
  } else {
    saveMessage(message)

  }
}
