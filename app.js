const { count } = require('console');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

ID = 0;
list = [];
app.get('/', function (req, res) {
   res.sendfile('index.html');
});

//Whenever someone connects this gets executed
// var nsp=io.of('/myid')
io.on('connection', function (socket) {

   // socket.broadcast.emit('alert','someone connected now');
   socket.on('room', (room) => {
      socket.join(room);
      socket.room = room;
   })


   socket.on('sms', (sms) => {
      console.log(sms)

      io.sockets.in(sms.room).emit('sms', sms);
   })
   socket.on('name', (name) => {
      socket.name = name;
      var temp = '' + ID;
      socket.id = temp;
      // console.log(typeof(temp),temp);
      data = { name: name, id: socket.id };
      list.push(data);
      socket.emit('list', { list: list });
      console.log(data);
      io.sockets.in(socket.room).emit('name', data);
      ID++;
   })
   socket.on('disconnect', function () {
      data = { name: socket.name, id: socket.id };
      io.sockets.in(socket.room).emit('removed', data);
      list.forEach(element => {
         _id = element.id;
         _name = element.name;
         if (_id == socket.id) {
            element.id = "NA";
         }
      });
   });

});



http.listen(process.env.PORT || 3000, function () {
   console.log('listening');
});
