var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Person = function () {
  this.x = 0;
  this.y = 0;
  this.name = "";
  this.points = 0;
  this.player_color = null;
  this.uuid = null;
};

var person = new Person();

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
  if (position[0] != person.x && position[1] != person.y) {
    person.x = position[0];
    person.y = position[1];
    console.log("x: " + person.x + ", " + "y: " + person.y);
    io.emit('player', person);
  } else {
    return 0;
  }
}
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  person.uuid = guid();
  console.log('Person #' + person.uuid + ' has joined :)');

  socket.on('position', function(position){
    check_and_set_position(position);
  });

  socket.on('set_color', function(color){
    if (person) {
      person.player_color = color;
    }
  });

  socket.on('disconnect', function(){
    console.log('Later Person #' + person.uuid + '!');
  });
});

http.listen(3000, function(){
  console.log('Picking up n00bs on :3000');
});