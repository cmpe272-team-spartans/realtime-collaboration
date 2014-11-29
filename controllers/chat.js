/**
 * Created by Yudong Yi on 11/26/14.
 */

var utils = require("../utils/utils.js")

exports.init = function(socket, rooms){
	// server gets new user request and checks if there is in the object users. if present then return false means user already present
    //, else update users obj, which contains nickname as key and socket as its value,
    // and send the updated user to client sockets including itself. 

    socket.on('new user', function(data, callback){

      //Make sure the room object is initialized
      if( rooms[data.roomNumber]==undefined) rooms[data.roomNumber] = {};

      if (data.nickName in rooms[data.roomNumber]){
        callback(false); // if data is in users, then already exists
      } else{
        callback(true);
        socket.nickname = data.nickName.toLowerCase();
        socket.roomNumber = data.roomNumber;
        rooms[data.roomNumber][socket.nickname] = socket; // saving nickname as key and save socket against them in users obj
        
        updateNicknames(data.roomNumber);
      }
    });

    // Server receives send message request which in turn emits data to all the client sockets including itself within the room.
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
              if(name in rooms[socket.roomNumber]){
                console.log(name);
                rooms[socket.roomNumber][name].emit('whisper', {msg: msg, nickname: socket.nickname}); //send msg to priv user
                rooms[socket.roomNumber][socket.nickname].emit('whisper', {msg: msg, nickname: socket.nickname+" -> "+name}); // also display to user sending it
                console.log('message sent is: ' + msg);
                console.log('Whisper!');
              } else{
                callback('Error!  Enter a valid user.');
              }
            } else{
              callback('Error!  Please enter a valid whisper message.');
            }
          } else{
              utils.broadCastInRoom(rooms, socket.roomNumber,'new message',{msg: msg, nickname: socket.nickname}) // if not whisper, send to everyone in a room
          }
        }
    });

    function updateNicknames(roomNumber){
      utils.broadCastInRoom(rooms, roomNumber, 'nicknames', Object.keys(rooms[roomNumber]));
    }

    socket.on('disconnect', function(data){
    if(!socket.nickname) return;
    delete rooms[socket.roomNumber][socket.nickname];
      updateNicknames(socket.roomNumber);
  });
}