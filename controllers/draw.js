/**
 * Created by Yudong Yi on 11/26/14.
 */

var utils = require("../utils/utils.js")

exports.init = function(socket,rooms) {
  // console.log(socket);
  // server receives drawClick request which in turn sends data to all the other client sockets not including itself
    socket.on('drawClick', function(inData) {
      var data = {
                    x: inData.x,
                    y: inData.y,
                    type: inData.type,
                    color:inData.color
                  };
      utils.broadCastInRoomExcludeUser(rooms, socket.roomNumber, inData.nickName, 'draw',data);    
      //The following code will broadcast message to all connected clients
      // socket.broadcast.emit('draw', {
      //   x: data.x,
      //   y: data.y,
      //   type: data.type,
      //   color:data.color
      // });
    });
    socket.on('clearCanvas', function(data) {
      console.log('clearCanvas')
      utils.broadCastInRoom(rooms, socket.roomNumber,'clearCanvas',null)
    });

}