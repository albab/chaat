var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var x = 0;
var y = 0;

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


function check_and_set_position(position) {
  if (position[0] != x && position[1] != y) {
    x = position[0];
    y = position[1];
    console.log("x: " + x + ", " + "y: " + y);
  } else {
    return 0;
  }
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var uuid = guid();
  console.log('Person #' + uuid + ' has joined :)');

  socket.on('position', function(position){
    check_and_set_position(position);
  });

  socket.on('disconnect', function(){
    console.log('Later Person #' + uuid + '!');
  });
});


http.listen(3000, function(){
  console.log('Picking up n00bs on :3000');
});