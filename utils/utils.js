/**
 * Created by Yudong Yi on 11/26/14.
 */


// Helper method that will broadcast message to everyone within the room number
exports.broadCastInRoom = function(rooms, roomNumber, signal, data){
	  for(user in rooms[roomNumber])
	  {
	    rooms[roomNumber][user].emit(signal, data);
	  }
}

exports.broadCastInRoomExcludeUser = function(rooms, roomNumber, aUser, signal, data){
	  for(user in rooms[roomNumber])
	  {
	  	if(user != aUser)
	    	rooms[roomNumber][user].emit(signal, data);
	  }
}
