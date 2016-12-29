var app = require('express')();
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

/*app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});*/

users = [];
io.on('connection', function(socket){

  socket.is_logged = false;
  
  socket.on('setUsername', function(data){
    if(users.indexOf(data) == -1){
      users.push(data);
      socket.emit('userSet', {username: data});
      socket.username = data;
      socket.is_logged = true;

      socket.emit('join', 'good morning ' + socket.username);
      //this event will broadcast the event to all other sockets except newly connected client
      socket.broadcast.emit('newUser', socket.username + ' join room');

      io.emit('updatepool', users);

    } else {
      console.log(data + ' username is taken! Try some other username.');
      socket.emit('userExists', data + ' username is taken! Try some other username.');
    }

  });
  
  socket.on('disconnect', function(){
    console.log('user disconnected');

    var index = users.indexOf(socket.username);
    if (index > -1) {
      users.splice(index, 1);
      console.log(socket.username + " removed from chat");
    }
    socket.broadcast.emit('message',{ message: socket.username + ' left the room'});
    io.emit('updatepool', users);
  });

  socket.on('message', function(msg){
    io.emit('message', {message: socket.username +" : "+ msg});
  });
 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});