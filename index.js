const express = require('express');
const req = require('express/lib/request');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { saveMessage, getMessages ,deleteUser} = require('./TemporalMsgDB')
const { guardarUsuario, getUserCredentials } = require('./UserDatabaseManager')
const { getUsersFromID,saveRoom } = require('./RoomDataDB')

const usersOnline = new Map()


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('User connected, waiting for login or register');

  socket.on('register', async (user,mail,password,image, callback) => {
    console.log('User register in=> ', user, ":")
  
    var code=await saveUser(user,password,mail,image);
    if(code){
      callback({
        code: "200"
      })
    }else{
      callback({
        code: "400"
      })
    }

  })

  socket.on('login', async (user, password, callback) => {
    var login=await checkLogin(user,password)
    console.log('Response '+login)
    if(login == 0) {
      callback({
        code: "400"
      })
      console.log('Bad credentials.')
      return;
    }
    console.log('User logged in=> ', user)
    usersOnline.set(user, socket)
    callback({
      code: "200",
      user: login
    })
    getPendingMessages(user)

    socket.on('message', async (msg) => {
      console.log("New message incoming from ",user)
      var obj = JSON.parse(msg)
      
      if (obj.type == "message") {
        var username = obj.content.username
        sendMessage(username, obj)
      }
      if (obj.type == "room-message") {
        var users = await getGroupUsers(obj.content.id)
        console.log(users)
        for (let index = 0; index < users.length; index++) {
          const user = users[index];
          sendMessage(user,obj)
        }
      }

    })
    socket.on('room-creation',(msg)=>{
      console.log("New room creation incoming from ",user)
      var obj = JSON.parse(msg)
      saveRoom(obj)
      sendGroupCreation(obj)
    })
    socket.on('offline',(user)=>{
      console.log(user+' has disconnected')
      usersOnline.delete(user)
    })
  })

  socket.on('disconnect', (er) => {
    console.log('User disconnected')
    
  })
});

function listen(){
  try{
  server.listen(1234, () => {
    console.log('listening on *:1234');
  });}catch(e){
    listen()
  }
}
listen()


async function getPendingMessages(user) {
  var docs = await getMessages(user)
  var socket = usersOnline.get(user)
    // Usage!
    sleep(2000).then(() => {
      // Do something after the sleep!
  
  for (var i = 0; i < docs.length; i++) {
    console.log('message send to ' + user);
    socket.emit("message", docs[i])
  }
});
  deleteUser(user)
}

async function getGroupUsers(id) {
  var user_list = await getUsersFromID(id)
  return user_list;


}

function sendMessage(username, message) {
  var userSocket = usersOnline.get(username)
  if(userSocket!=null){
    console.log("Message sended to ",username,". Message: ",message)
    userSocket.emit("message", message)
  } else {
    saveMessage(message)

  }
}

function sendGroupCreation(room){
  id= room.content.id
  console.log("Sending group creation for roomId> ",id)
  var list= room.content.users
  for (let index = 0; index < list.length; index++) {
    const user = list[index];
    sendMessage(user,room)
  }
  
}

async function saveUser(user,password,mail,image){
return await guardarUsuario(user,password,mail,image)

}
async function checkLogin(user,password){
  var login=  await getUserCredentials(user,password)
  console.log('Response from db ',login)
  if(login.length>0) return login; 
  return 0;
  }
  
  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
