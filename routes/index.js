var express = require('express');
var router = express.Router();
var db = require('../controllers/database.js');
var md5 = require('MD5');

router.get('/', function (req, res) {
    res.render('main', { title: 'Welcome'});
});
router.get('/showLogin', function (req, res) {
    res.render('login', { title: 'Welcome'});
});

// Join a room
router.post('/room', function (req, res) {
	var jsondata = {
		roomNumber: req.body.roomNumber,
		password: md5(req.body.password)
	};
	var roomNumber = db.findRoom(jsondata, function(err,room){
		if(err) res.send("db error");
		else if (room == null) res.send("Can't find the room");
		else res.render('dashboard', {title:'Room:'+jsondata.roomNumber,roomNumber:jsondata.roomNumber});
	});
});

// render create room page .. anchor sends get request
router.get('/createRoom', function (req, res) {
    res.render('createRoom', { title: 'Create a room'});
});

// create a room
router.post('/createRoom', function (req, res) {
	if(req.body.topic.trim() != '')
	{
		var jsondata = {
			topic: req.body.topic,
			password: md5(req.body.password)
		};		
		console.log(jsondata);
		db.createRoom(jsondata, function(err, room){
			if(err) res.send("db error");
			else res.render('dashboard', {title:'Room:'+room.roomNumber,roomNumber:room.roomNumber});
		});
	}
	else
		res.send("Missing required information");
});

module.exports = router;