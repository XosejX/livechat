var express = require ("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
//var dl = require("delivery");
//var fs = require("fs");

/* HEROKU */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

app.use(express.static('public'));
app.get("/", function(peticion, respuesta){
    respuesta.sendFile('index.html');    
});

var userList = [];
io.on("connection", function(socket){
    userList.push(socket);
    socket.on("addUser", function(user){
        socket.nick = user;
        io.emit("addUser", user);
    });
    socket.on("chat message", function(msg, cls){
        console.log("Conexion: message --> " + msg);
        io.emit('chat message', msg, cls);
    });
    socket.on("disconnect", function(){
        io.emit("delUser");
        
        var i = userList.indexOf(socket);
        userList.splice(i, 1);
        
        console.log("user online: " + userList.length);
    });
    
    socket.on("showUser", function(text, state, img){
        io.emit('showUser', text, state, img);
    });
});

http.listen(port, function(){
    console.log("listening on port XXXX...");
});