var express = require ("express");
var app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http);

/* HEROKU */
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);


app.use(express.static('public'));
app.get("/", function(peticion, respuesta){
    respuesta.sendFile('index.html');    
});

//io.on("connection", function(socket){
//    console.log("somebody connected C:");
//    socket.on("disconnect", function(){
//        console.log("somebody disconnected :C");
//    });
//});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

io.on("connection", function(socket){
    socket.on("chat message", function(msg){
        console.log("message --> " + msg);
        io.emit('chat message', msg);
    });
});


http.listen(port, function(){
    console.log("listening on port 3000...");
});