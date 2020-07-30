var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const PORT=3000;
app.get('/', function(req, res) {
   res.sendfile('index.html');
});

//Whenever someone connects this gets executed
// var nsp=io.of('/myid')
io.on('connection', function(socket) {

      socket.broadcast.emit('alert','someone connected now');
      socket.on('room',(room)=>{
         socket.join(room);
      })
    

   socket.on('sms',(sms)=>{
      console.log(sms)
      io.sockets.in(sms.room).emit('sms',sms);
   })
  
});
  


http.listen(PORT, function() {
   console.log('listening on *:3000');
});