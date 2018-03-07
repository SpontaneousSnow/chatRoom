var app = require('express')();
var fs = require('fs');
var ss = require('socket.io-stream');
var io = require('socket.io-client');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.emit('some event', { for: 'everyone' });

io.of('/user').on('connection', function(socket) {
  ss(socket).on('profile-image', function(stream, data) {
    var filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream(filename));
  });
});

io.on('connection', function(socket){
    console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
    socket.on('img', function(data){  
    io.sockets.emit('displayImg', data);
    });
    fs.readFile('image.png', function(err, data){
    socket.emit('imageConversionByClient', { image: true, buffer: data });
    socket.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64"));
    socket.emit('img', data);
  });
    socket.on('displayImg', function(data){ 
        console.log('image');
    document.getElementById('imgid').src = 'data:image/png;base64,' + data;
    });   
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});