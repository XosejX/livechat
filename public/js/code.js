function escapeHtml(text) {
    /* Replaces special characters of HTML for the code of character */
    text += " ";
    text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    
    /* Check if the message is empty. */
    if (text.length > 0){
        var result = text.match(/\s/g);
        if (text.length > result.length){
            return text;
        }else{return false;}
    }else{return false;}
}

function updateScroll(){
    /* When overflow exists, autoscroll to bottom */
    var element = $(".main");
    element.scrollTop(element.prop('scrollHeight'));
}

function selectNick(){
    var val = $("#nick").val();
    var state = $("#st").val();
    var img = $('input[name="a"]:checked').val();
    
    val = escapeHtml(val);
    state = escapeHtml(state);
    
    if (val.length > 0 && state.length > 0){
        /* Check if the user exists */
        socket.emit("addUser", val, state, img, function(callback){
            if (callback){
                $("#myModal").modal('hide');
            }
            else{
                $(".errorUser").html("Sorry, that user is taken, try other user");
            }
        });
    }
}

function videoUp(){
    $(".glyphicon-facetime-video").click(function(){
        var display = $("#cam").css("display");
        if (display == "none"){
            $("#cam").css("display", "inline");
        }else{
            $("#cam").css("display", "none");
        }
    });
}

$(function(){
    $("#myModal").modal('show');
    $("input").focus();
    $("#room").change(function(){
        socket.emit("change room", $("#room").val());
    });
});


var socket = io();
$('#chat').submit(function(){
    socket.emit('chat message', $('#text').val());
    $('#text').val('');
    return false;
});

socket.on("addUserChat", function(users){
    $('#user').empty();
    for (var i=0; i < users.length; i++){
        var video = ('<p><span class="glyphicon glyphicon-facetime-video"></span></p>');
        var private = ('<p><span class="glyphicon glyphicon-lock"></span></p> ');
        var div = ('<hr/><div>State: ' + users[i].state + '</div>');
        $("#user").append($("<li><img class='ava' src='" + users[i].img + "'/>" + users[i].nick + video + private + div + "<div class='secret' id='" + users[i].id + "'></div></li>"));
    }
    
    videoUp();
});

socket.on('chat message', function(msg, nick, id){
    msg = escapeHtml(msg);
    if (msg && socket.id == id){
        $('#line').append($('<li class="send"><b>' + nick + "</b>: " + msg + '</li>'));
    }
    if (msg && socket.id != id){
        $('#line').append($('<li class="other"><b>' + nick + "</b>: " + msg + '</li>'));
    }
    updateScroll();
});

socket.on("changeRoom", function(room){
    if ($("#videoS")){
        $("#videoS").remove();
    }
    
    $("#cam").css("display", "none");
    $("#line").html("").append($('<li class="new">Welcome to <b>' + room + '</b>!</li>'));
});

socket.on("delUser", function(nick){
    if (!nick){return;} //For when reload the page without login.
    
    $('#line').append($('<li class="new">User <b>' + nick + '</b><font color="red">disconnected</font></li>'));
});

socket.on("showUser", function(nick){
    $('#line').append($('<li class="new">User <b>' + nick + ' </b><font color="green">connected</font></li>'));
});


/* Start event INTERVAL when USER TYPE */
function interval (){
    /* Create the interval while a user write */
    inter = setInterval(function(){
        socket.emit("typeOut");
        clearInterval(inter);
        inter = false;
    }, 600);
}

var inter = false;
$("#text").keyup(function(){
    if (!inter){
        socket.emit("typeIn");
        interval();
    }
    else{
        clearInterval(inter);
        interval();
    }
});

socket.on("type", function(id){
        $("#"+id).text("Writing...");
});

socket.on("typeOff", function(id){
        $("#"+id).text("");
});
/* Finish event INTERVAL */

/* Stream cam */
socket.on("stream", function(image){
    $("#play").attr("src", image);
});

/* Send images */
socket.on('sendImage', function (nick, base64Image, id) {
    /* Check if is the sender or not for set the class */
    if (socket.id == id){
        $('#line').append($('<li class="send"><b>' + nick + '</b>: <img id="fil" src="' + base64Image + '"/></li>'));
    }
    if (socket.id != id){
        $('#line').append($('<li class="other"><b>' + nick + '</b>: <img id="fil" src="' + base64Image + '"/></li>'));
    }
    updateScroll();
});