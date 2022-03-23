const express = require('express');
const req = require('express/lib/request');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { saveMessage, getMessages } = require('./TemporalMsgDB')

const usersOnline = new Map()



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('User connected, waiting for login');
  socket.on('login', (user, password) => {
    console.log('User logged in=> ', user, ":", password)
    usersOnline.set(user, socket)
    getPendingMessages(user)
    socket.on('message', (msg) => {
      var obj = JSON.parse(msg)
      if (obj.type == "message") {
        var username = obj.content.username
        var userSocket = usersOnline.get(username)
        if (userSocket != null) {
          userSocket.emit("message", obj)
        } else {
          saveMessage(obj)
          //todo
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
    socket.emit("message", docs)
  }
}