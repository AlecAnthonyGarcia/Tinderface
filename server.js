var express = require("express");
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('build'));
app.use('/', require('./src/server/routers/index'));

var server = app.listen(3000);
var io = require("socket.io").listen(server, () => {});

io.sockets.on('connection', function(socket){
    console.log("a user connected");

    socket.on('ping', function() {
        // broadcast to just the sender
        socket.emit('pong');
    });

    socket.on('click', function(_) {
        // broadcast to all including sender
        io.sockets.emit('message');
    });

});