var express = require ("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
//var dl = require("delivery");
//var fs = require("fs");

var userList = [];

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


io.on("connection", function(socket){
    socket.on("addUser", function(user, state, img, callback){
        /* Check if the user exists */
        if (userList.indexOf(user) != -1){
            callback(false);
        }
        else{
            callback(true);
            socket.nick = user;
            userList.push({nick: user, state: state, img: img});
            updateUsers();
        }
    });
    
    function updateUsers(){
        io.emit("addUserChat", userList);
    }
    
    socket.on("chat message", function(msg){
        console.log("Conexion: message --> " + msg);
        console.log(socket.nick);
        io.emit('chat message', msg, socket.nick);
    });
    
    socket.on("disconnect", function(){
        io.emit("delUser", socket.nick);
        
        if (!socket.nick) return;
        
        for (var i=0; i<userList.length; i++){
            if (socket.nick == userList[i].nick){
                userList.splice(i, 1);
            }
        }
        
        updateUsers();
    });
    
    socket.on("showUser", function(text, state, img){
        io.emit('showUser', text, state, img);
    });
});

http.listen(port, function(){
    console.log("listening on port XXXX...");
});