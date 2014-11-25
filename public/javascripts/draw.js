
function colorPicker() {

  $("#colorpicker").spectrum({
      color: "#000000",
      showInput: true,
      className: "full-spectrum",
      showInitial: true,
      showPalette: true,
      showSelectionPalette: true,
      maxPaletteSize: 10,
      preferredFormat: "hex",
      localStorageKey: "spectrum.demo",
      move: function (color) {
          
      },
      show: function () {
 
      },
      beforeShow: function () {
      
      },
      hide: function (color) {
      },
      change: function(color) {
        $("#colHidden").val(color.toHexString());
      },
      palette: [
          ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
          "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
          ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
          "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
          ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
          "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
          "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
          "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
          "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
          "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
          "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
          "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
          "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
          "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
      ]
  });
  
  /*
  $("#colorpicker").spectrum({
      color: "#f00",
      change: function(color) {
        $("#colHidden").val(color.toHexString());
        $("#basic-log").text("change called: " + color.toHexString());
    }
  });*/
}

(function() {
  var App;
  App = {};
  /*
  	Init 
  */

  App.init = function() {
    //Bind touch event listener
    document.addEventListener("touchstart");
    document.addEventListener("touchmove");
    document.addEventListener("touchend");
    document.addEventListener("touchcancel");    

    App.socket = io.connect('http://localhost:3000');

/*************************************CANVAS FUNCTIONALITY***********************************/
    App.canvas = $("#mainCanvas").get(0);
    console.log(App.canvas);
    App.canvas.height = 480;
    App.canvas.width = 1200;
    document.getElementsByTagName('article')[0].appendChild(App.canvas);
    App.ctx = App.canvas.getContext("2d");
    App.ctx.fillStyle = "solid";
    App.ctx.strokeStyle = "#000000";
    App.ctx.lineWidth = 5;
    App.ctx.lineCap = "round";

    App.socket.on('draw', function(data) {
      console.log(data);
      return App.draw(data.x, data.y, data.type, data.color);
    });
    
    //Initialize color picker
    colorPicker();

    App.draw = function(x, y, type, color) {
    	App.ctx.strokeStyle = color;
    	/*if(color=="#986928") App.ctx.strokeStyle = "#986928";
    	if(color=="#ECD018") App.ctx.strokeStyle = "#ECD018";*/
      if (type === "dragstart") {
        App.ctx.beginPath();
        return App.ctx.moveTo(x, y);
      } else if (type === "drag") {
        App.ctx.lineTo(x, y);
        return App.ctx.stroke();
      } else {
      	App.ctx.strokeStyle =  $("#colHidden").val();
        return App.ctx.closePath();
      }
    };
/*************************************END OF CANVAS FUNCTIONALITY***********************************/

/*************************************CHAT FUNCTIONALITY***********************************/    
    var $chatForm = $('#chatForm');
    var $messageBox = $('#message');
    var $chatWindow = $('#chatWindow');
    var $nickForm = $('#nickForm');
    var $nickError = $('#nickError');
    var $nickName = $('#nickName');
    var $roomNumber = $('#roomNumber');
    var $users = $('#users');
    // Called when nickName is submitted
    $nickForm.submit(function(e){
      e.preventDefault();
      
      App.socket.roomNumber = $roomNumber.val();
      App.socket.nickName = $nickName.val();

      var user = {
        nickName : App.socket.nickName,
        roomNumber : App.socket.roomNumber
      };
      console.log(user);
      App.socket.emit('new user', user, function(data){
        if(data){
          $('#nickWrap').hide();
          $('#contentWrap').show();
        } else{
          $nickError.html('That nickName is already taken!  Try again.');
        }
      });
      $nickName.val('');
    });

    // Event handler on getting nickname from the server to display users
    App.socket.on('nicknames', function(data){
        var html = '<b>Users</b><br/>';
        for(i=0; i < data.length; i++){
          html += data[i] + '<br/>'
        }
        $users.html(html);
    });

    // Submit the chat message to main chat(private and public)
    $chatForm.submit(function(e){
      e.preventDefault();

      App.socket.emit('send message', $messageBox.val(), function(data){
          $chatWindow.append('<span class="error">' + data + "</span><br/>"); //called only when there is an error callback passed
        });
      $messageBox.val('');
    });
    // Event handler on getting the new message
    App.socket.on('new message', function(data){
      $chatWindow.append('<span class="msg"><b>' + data.nickname + ': </b>' + data.msg + "</span><br/>");
    });
    // Event handler on getting the new private message
    App.socket.on('whisper', function(data){
      $chatWindow.append('<span class="whisper"><b>' + data.nickname + ': </b>' + data.msg + "</span><br/>");
    });
/*************************************END OF CHAT FUNCTIONALITY***********************************/
}; // End of App.init()


  /*
  	Draw Events
  */
/*************************************CANVAS FUNCTIONALITY***********************************/
  $('canvas').live('touchstart touchmove touchend drag dragstart dragend', function(e) {

    e.preventDefault();
    var offset, type, x, y;

    //Map touch events to mouse events
    switch(e.type)
    {
        case "touchstart": type = "dragstart"; break;
        case "touchmove":  type="drag"; break;        
        case "touchend":   type="dragend"; break;
        default: type = e.handleObj.type;
    }
    
    x = e.pageX - this.offsetLeft;
    y = e.pageY - this.offsetTop;

    var colr = $("#colHidden").val();
    App.ctx.strokeStyle = colr;

    App.draw(x, y, type);
    var data = {
        roomNumber:App.socket.roomNumber,
        nickName:App.socket.nickName,
        x: x,
        y: y,
        type: type,
        color:colr
    };
    App.socket.emit('drawClick', data);
  });
  $(function() {
    return App.init();
  });
}).call(this);

/*************************************END OF CANVAS FUNCTIONALITY***********************************/



