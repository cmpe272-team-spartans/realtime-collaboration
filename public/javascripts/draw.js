
function btnBrown() {

	$("#colHidden").val("#986928");
}
function btnYellow() {

	$("#colHidden").val("#ECD018");
}
(function() {
  var App;
  App = {};
  /*
  	Init 
  */

  App.init = function() {
    App.canvas = document.createElement('canvas');
    console.log(App.canvas);
    App.canvas.height = 480;
    App.canvas.width = 800;
    document.getElementsByTagName('article')[0].appendChild(App.canvas);
    App.ctx = App.canvas.getContext("2d");
    App.ctx.fillStyle = "solid";

    App.ctx.strokeStyle = "#000000";
    App.ctx.lineWidth = 5;
    App.ctx.lineCap = "round";
    App.socket = io.connect('http://localhost:3000');
    App.socket.on('draw', function(data) {
      console.log(data);
      return App.draw(data.x, data.y, data.type, data.color);
    });
    App.draw = function(x, y, type, color) {
    	if(color=="#000000") App.ctx.strokeStyle = "#000000";
    	if(color=="#986928") App.ctx.strokeStyle = "#986928";
    	if(color=="#ECD018") App.ctx.strokeStyle = "#ECD018";
      if (type === "dragstart") {
        App.ctx.beginPath();
        return App.ctx.moveTo(x, y);
      } else if (type === "drag") {
        App.ctx.lineTo(x, y);
        return App.ctx.stroke();
      } else {
      	console.log($("#colHidden").val());
      	App.ctx.strokeStyle =  $("#colHidden").val();
        return App.ctx.closePath();
      }
    };
  };
  /*
  	Draw Events
  */
  $('canvas').live('drag dragstart dragend', function(e) {
    var offset, type, x, y;
    type = e.handleObj.type;
    x = e.pageX - this.offsetLeft;
    y = e.pageY - this.offsetTop;

    var colr = $("#colHidden").val();
    console.log(colr);
    App.ctx.strokeStyle = colr;

    App.draw(x, y, type);
    var data = {
        x: x,
        y: y,
        type: type,
        color:colr
    };
    App.socket.emit('drawClick', data);
    console.log(data);
  });
  $(function() {
    return App.init();
  });
}).call(this);

// tool.maxDistance = 50;
// // Returns an object specifying a semi-random color
// // The color will always have a red value of 0
// // and will be semi-transparent (the alpha value)
// function randomColor() {
    
//     return {
//         red: 0,
//         green: Math.random(),
//         blue: Math.random()
// //        alpha: ( Math.random() * 0.25 ) + 0.05
//     };
// }
// // every time the user drags their mouse
// // this function will be executed
// function onMouseDrag(event) {
//     // Take the click/touch position as the centre of our circle
//     var x = event.middlePoint.x;
//     var y = event.middlePoint.y;
//     // The faster the movement, the bigger the circle
//     var radius = event.delta.length / 2;
//     // Generate our random color
//     var color = randomColor();
//     // Draw the circle 
//     drawCircle( x, y, radius, color );
//     // Pass the data for this circle
//     // to a special function for later
//     emitCircle( x, y, radius, color );
// } 
 
// function drawCircle( x, y, radius, color ) {
//     // Render the circle with Paper.js
//     var circle = new Path.Circle( new Point( x, y ), radius );
//     circle.fillColor = new RgbColor( color.red, color.green, color.blue, color.alpha );
//     // Refresh the view, so we always get an update, even if the tab is not in focus
//     view.draw();
// } 
 
// // This function sends the data for a circle to the server
// // so that the server can broadcast it to every other user
// function emitCircle( x, y, radius, color ) {

//     // Each Socket.IO connection has a unique session id
//  //   var sessionId = io.socket.sessionid;
  
//     // An object to describe the circle's draw data
//     var data = {
//         x: x,
//         y: y,
//         radius: radius,
//         color: color
//     };

//     // send a 'drawCircle' event with data and sessionId to the server
//     io.emit( 'drawCircle', data )

//     // Lets have a look at the data we're sending
//     console.log( data )

// }
// // Listen for 'drawCircle' events
// // created by other users
// io.on( 'drawCircle', function( data ) {
//     console.log( 'drawCircle event recieved:', data );
//     drawCircle( data.x, data.y, data.radius, data.color );
// })


