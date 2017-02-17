var express = require ("express");
var app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http);


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

io.on("connection", function(socket){
    socket.on("chat message", function(msg){
        //$('#line').append($('<li>').text(msg));
        console.log("message --> " + msg);
        io.emit('chat message', msg);
    })
});


http.listen(3000, function(){
    console.log("listening on port 3000...");
});