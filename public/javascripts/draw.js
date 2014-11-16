
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
//    App.canvas = document.createElement('canvas');
    App.canvas = $("#mainCanvas").get(0);
    console.log(App.canvas);
//    App.canvas.id="mainCanvas";
    App.canvas.height = 480;
    App.canvas.width = 1200;
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
    var $chatForm = $('#chatForm');
    var $messageBox = $('#message');
    var $chatWindow = $('#chatWindow');
    var $nickForm = $('#nickForm');
    var $nickError = $('#nickError');
    var $chatName = $('#chat-name');
    var $users = $('#users');
    // Called when Nickname is submitted
    $nickForm.submit(function(e){
      e.preventDefault();
      App.socket.emit('new user', $chatName.val(), function(data){
        if(data){
          $('#nickWrap').hide();
          $('#contentWrap').show();
        } else{
          $nickError.html('That username is already taken!  Try again.');
        }
      });
      $chatName.val('');
    });
    // Event handler on getting nicknames from the server to display users
    App.socket.on('usernames', function(data){
        var html = '';
        for(i=0; i < data.length; i++){
          html += data[i] + '<br/>'
        }
        $users.html(html);
    });
    // Submit the chat message to main chat
    $chatForm.submit(function(e){
      e.preventDefault();
      App.socket.emit('send message', $messageBox.val());
      $messageBox.val('');
    });
    // Event handler on getting the new message
    App.socket.on('new message', function(data){
      $chatWindow.append('<b>'+data.nickname+' : </b>'+data.msg + "<br/>");
    });
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
    App.ctx.strokeStyle = colr;

    App.draw(x, y, type);
    var data = {
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



