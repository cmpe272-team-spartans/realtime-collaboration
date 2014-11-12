
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

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

    socket.on('drawClick', function(data) {
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type,
        color:data.color
      });
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
//     io.on( 'drawCircle', function( data ) {
//     console.log( 'drawCircle event recieved:', data );
// })
//     socket.on( 'drawCircle', function( data) {
// // 	socket.broadcast.emit( 'drawCircle', data );
//  	io.sockets.emit( 'drawCircle', data );
//     console.log( data );
// })
});