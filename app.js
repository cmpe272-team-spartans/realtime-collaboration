
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
var rooms={}; // object storing nickname as key and socket as value

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

//Socket.io, drawing, chatting setup
var draw = require("./controllers/draw.js")
var chat = require("./controllers/chat.js")
io.sockets.on('connection', function (socket) {
  draw.init(socket,rooms);
  chat.init(socket,rooms);
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

