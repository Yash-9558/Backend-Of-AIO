const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

//socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = [];

io.on("connection", (socket) => {
  socket.on("join", (username) => {    
    users.push({socket_id:socket.id,username:username});
    // socket.join(data);
    console.log(`User with ID: ${socket.id} username: ${username}`);
    io.emit('enter', users);
  });

  socket.on('getUsers',()=>{
    socket.emit('recv_users',users) //jya thi fire thayu aene return ma emit (tya catch(on) method hase)
  })

  
  socket.on("recvside..",(obj)=>{
    console.log(obj);
    io.to(obj.recv_id).emit("senderside..",obj);
  })

  socket.on("send_message",(data)=>{
      io.to(data.room).emit('receive_message',data);
  })

  socket.on('request',(obj)=>{
    console.log(obj);
    io.to(obj.recv_id).emit('response',obj);
  })

  socket.on("disconnect", () => {
      let index = -1;
      let username;
      for(let i = 0;i<users.length;i++){
        if(users[i].socket_id == socket.id){
          index=i;
          username=users[i].username;
          break;
        }
      }
      if(index !== -1) users.splice(index,1);
      io.emit('exit', users);
      console.log(`User with ID: ${socket.id} username: ${username} Disconnected`);
  });
  
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});