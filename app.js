
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var nicknames=[];
var app = express();

var port = 3000;
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var io = require('socket.io').listen(app.listen(port));
app.get('/', routes.index);
app.get('/users', user.list);

//var server = http.createServer(app).listen( app.get('port') );
// var io = require('socket.io').listen(server, function() {
//         console.log("Express server listening on port " + app.get('port'));
// });

//http.createServer(app).listen(app.get('port'), function(){
 // console.log('Express server listening on port ' + app.get('port'));
//});
// A user connects to the server (opens a socket)


io.sockets.on('connection', function (socket) {

    // server receives drawClick request which in turn sends data to all the other client sockets not including itself
    socket.on('drawClick', function(data) {
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type,
        color:data.color
      });0
      console.log(data);
    });
  
    // (2): The server recieves a ping event
    // from the browser on this socket
    socket.on('ping', function ( data ) {  
      console.log('socket: server recieves ping (2)');
      // (3): Return a pong event to the browser
      // echoing back the data from the ping event 
      socket.emit( 'pong', data );   
      console.log('socket: server sends pong (3)');
    });
    // server gets new user request and checks if there is in the array(nicknames). if present then return, else
    // update nicknames array and send the updated user to client sockets including itself. 
    socket.on('new user', function(data, callback){
      if (nicknames.indexOf(data) != -1){
        callback(false);
      } else{
        callback(true);
        socket.nickname = data;
        nicknames.push(socket.nickname);
        io.sockets.emit('usernames', nicknames);
      }
    });

    // Server receives send message request which in turn emits data to all the client sockets including itself.
    socket.on('send message', function(data){
      console.log(data);
        io.sockets.emit('new message', {msg:data, nickname:socket.nickname});
    });
});