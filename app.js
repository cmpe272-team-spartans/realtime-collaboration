
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

//Database
var mongoose = require("mongoose");
var dbConnection = mongoose.connect("mongodb://localhost/rtcb");
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(dbConnection);

var routes = require('./routes/index');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', routes);
app.set('port', process.env.PORT || 3000);
var port = app.get('port');

// http configuration
var server = http.createServer(app).listen( port );
  var io = require('socket.io').listen(server, function() {
    console.log("Express server listening on port " + port);
});

//Redis
// var redis = require("redis"),
//     redisClient = redis.createClient();
// redisClient.on("error", function (err) {
//     console.log("Error " + err);
// });

//Socket.io
io.sockets.on('connection', function (socket) {
   // console.log(socket);
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
//      console.log('socket: server recieves ping (2)');
      // (3): Return a pong event to the browser
      // echoing back the data from the ping event 
      socket.emit( 'pong', data );   
//      console.log('socket: server sends pong (3)');
    });
    // server gets new user request and checks if there is in the object users. if present then return false means user already present
    //, else update users obj, which contains nickname as key and socket as its value,
    // and send the updated user to client sockets including itself. 
    var users={}; // object storing nickname as key and socket as value

    socket.on('new user', function(data, callback){
      if (data in users){
        callback(false); // if data is in users, then already exists
      } else{
        callback(true);
        socket.nickname = data.toLowerCase();
        users[socket.nickname] = socket; // saving nickname as key and save socket against them in users obj
        updateNicknames();
        console.log(data);
      }
    });

    // Server receives send message request which in turn emits data to all the client sockets including itself.
    // whisper msg will be '/w username message'
    socket.on('send message', function(data, callback) {
        var msg = data.trim();
        console.log('after trimming message is: ' + msg);
        if(msg !== '') {
          if(msg.substr(0,3) === '/w '){ //check if whisper
            msg = msg.substr(3);          // msg contains 'username message'
            var ind = msg.indexOf(' ');
            if(ind !== -1){
              var name = msg.substring(0, ind).toLowerCase(); //name contains 'username'
              var msg = msg.substring(ind + 1);       //msg now contains 'message'
              if(name in users){
                console.log(name);
                users[name].emit('whisper', {msg: msg, nickname: socket.nickname}); //send msg to priv user
                users[socket.nickname].emit('whisper', {msg: msg, nickname: socket.nickname+" -> "+name}); // also display to user sending it
                console.log('message sent is: ' + msg);
                console.log('Whisper!');
              } else{
                callback('Error!  Enter a valid user.');
              }
            } else{
              callback('Error!  Please enter a valid whisper message.');
            }
          } else{
            io.sockets.emit('new message', {msg: msg, nickname: socket.nickname}); // if not whisper, main chat msg..pass regularly
          }
        }
    });

    function updateNicknames(){
      io.sockets.emit('usernames', Object.keys(users)); //nicknames
    }

    socket.on('disconnect', function(data){
    if(!socket.nickname) return;
    delete users[socket.nickname];
    updateNicknames();
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// development only
if ('development' == app.get('env')) {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

