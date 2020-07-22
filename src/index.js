 const path = require('path')
 const http = require('http')
const express = require('express');
const socketio = require('socket.io') ;
const Filter = require('bad-words');
const {generateMessage , generateLocationMessage} = require('./utils/messages');
const {addUser , getUsersInRoom , getUser , removeUser} = require('../src/utils/user');
// this create instance of websocket to work with our server , it gives us a function back , to work in this server , we need to call it .
const app = express();
// create http ,http library and method available on it , led us create a server , though express do it underhood.
const server = http.createServer(app);
// this is the function we acquire , we will pass it the server , so refracting will be done , when express creates it underhood we don't have access to server.
const io = socketio(server);

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname ,'../public');

app.use(express.static(publicDirectoryPath));

let msg ="Welcome";
io.on('connection' , (socket)=>{
    console.log('New WebSocket Connection')
    // server is emitting to particular client , the message of welcome , 
    // to send to every other client use io.emit
    // socket.emit('message' , msg)
    // socket.emit('message' , generateMessage(msg));
    // we will get object and object in browser , as this is object  , need to adjust on client.js . now this is emitted to everyone , now we just want it to be room specific , so commenting and adding in join event after joining rooms .

    // send object not simple string  , and now also room specific so going to comment from here , 
    // socket.broadcast.emit('message' , generateMessage('A new user has joined Cules'));
        socket.on('join' , ({username , room} , callback)=>{
            // this is basically 4 functions we implemented , socket.id is socket id  
            const {error , user} = addUser({id : socket.id , username , room});
            // as addUser is going to return trimed object of user , so need to use that.
            if(error) {
                  return callback(error); 
            }
            socket.join(user.room); // this is inbuilt provided to join the room 
            socket.emit('message' , generateMessage("admin" , msg));
            socket.broadcast.to(user.room).emit('message' , generateMessage("admin" , `${user.username} has joined`));
            io.to(user.room).emit('roomData' , {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            callback();
        })
        // socket.emit , io.emit , socket.broadcast.emit.
        // io.to.emit , socket.broadcast.to.emit ,  for rooms .
     socket.on('sendMessage' , (txt , callback)=> {
             const user = getUser(socket.id);
        //   console.log(txt);
        //  let's have bad words thing 
            const filter = new Filter();
            if(filter.isProfane(txt)){
                 return callback('Profanity is not allowed!');
            }

           
          io.to(user.room).emit('message' , generateMessage(user.username,txt));
          callback('Delivered!!');  // we have set acknowledgemnt to be sent to the one who is emitting , it process the data , then call that function . 
     })
    //  emitted by chat.js for sharing it's all cordinates.
     socket.on('sendLocation' , (obj , callback)=>{
            //  io.emit('location' , obj); one way is this ,
            // io.emit('rohit' , `Location: ${obj.lat} , ${obj.long}`);
            //  to send map as well , use https://google.com/maps?q=0,0 
            // q means lat = 0 , long = 0;
            // io.emit('message' , `https://google.com/maps?q=${obj.lat},${obj.long}`);
            // callback();
            //  we are going to emit different event as different params , for ourself
            const user = getUser(socket.id);
            io.to(user.room).emit('locationMessage' , generateLocationMessage(user.username,`https://google.com/maps?q=${obj.lat},${obj.long}`));
            callback();
     })
     socket.on('disconnect' , ()=>{
           const user = removeUser(socket.id);
           if(user){
            io.to(user.room).emit('message' , generateMessage("admin" , `${user.username} has left !`));
            io.to(user.room).emit('roomData' , {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
           }
          
     })
})
// server side se connection setup krdiya , lekin client side se krna pdega toh , index.html mh jakr , socket.io/socket.io.js file ko add krdiya , aur phir apna , js folder mh chat.js bnakr , usme io functionality aagyi merepaas. toh call krdiya io() ko , 


// instead of app , we should use server.
server.listen(port , ()=>{
    console.log(`Server is up on port ${port}!`)
})