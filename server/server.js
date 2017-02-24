var express = require ("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
//var dl = require("delivery");
//var fs = require("fs");

var userList = [];
var lista = [];

/* Set the port for HEROKU */
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
        /* Create array of usernick for use indexOf */
        for (var i=0; i<userList.length; i++){
            lista.push(userList[i].nick);
        }
        /* Check if the user exists */
        if (lista.indexOf(user) != -1){
            callback(false);
        }
        else{
            callback(true);
            socket.nick = user;
            userList.push({nick: user, state: state, img: img});
            socket.broadcast.emit("showUser", socket.nick);
            updateUsers();
        }
    });
    
    function updateUsers(){
        io.emit("addUserChat", userList);
    }
    
    socket.on("chat message", function(msg){
        io.emit('chat message', msg, socket.nick, socket.id);
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
    
    socket.on("showUser", function(text){
        io.emit('showUser', text);
    });
});

http.listen(port, function(){
    console.log("listening on port XXXX...");
});