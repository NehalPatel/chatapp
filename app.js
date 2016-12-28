var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
    socket.broadcast.emit('newclientconnect',{ description: 'a client left the room'})
  });

  socket.on('message', function(msg){
    io.emit('message', msg);
  });

  //this event will be emit to the newly connected client ( .on('connection') )
  socket.emit('newclientconnect',{ description: 'Hey, welcome!'});

  //this event will broadcast the event to all other sockets except newly connected client
  socket.broadcast.emit('newclientconnect',{ description: 'new client connected!'});
 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});