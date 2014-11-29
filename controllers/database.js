/**
 * Created by Yudong Yi on 11/25/14.
 */
 
var Room = require('../models/room.js');
module.exports = {
	findRoom: function(jsondata, callback){
		Room.findOne({"roomNumber":jsondata.roomNumber, "password":jsondata.password}, function(err, room){
			if(err) callback(err);
			else callback(null, room);
		});
	},	
	createRoom: function(jsondata, callback){
    	new Room(jsondata).save(function(err, room){
            if (err) callback(err);
            else callback(null, room);
        });
	}
};
