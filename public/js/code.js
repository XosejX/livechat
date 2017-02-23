function escapeHtml(text) {
    text += " ";
    text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    
    if (text.length > 0){
        var result = text.match(/\s/g);
        if (text.length > result.length){
            return text;
        }else{return false;}
    }else{return false;}
}

function selectNick(){
    var val = $("#nick").val();
    var state = $("#st").val();
    var img = $('input[name="a"]:checked').val();
    
    val = escapeHtml(val);
    state = escapeHtml(state);
    
    if (val.length > 0 && state.length > 0 && img.length > 0){
        /* Check if the user exists */
        socket.emit("addUser", val, state, img, function(callback){
            if (callback){
                $("#myModal").modal('hide');
                socket.emit('showUser', val, state, img);
            }
            else{
                $(".errorUser").html("Sorry, that user is taken, try other user");
            }
        });
    }
}

$(function(){
	$(document).ready(function(){
		$("#myModal").modal('show');
	});
    $("input").focus();
});


var socket = io();
$('#chat').submit(function(){
    socket.emit('chat message', $('#text').val());
    $('#text').val('');
    return false;
});

socket.on("delUser", function(nick){
    $('#line').append($('<li class="new">User <b>' + nick + '</b><font color="red">disconnected</font></li>'));
});

socket.on("addUserChat", function(users){
    $('#user').empty();
    for (var i=0; i < users.length; i++){
        //$('#line').append($('<li class="new">User [' + users[i] + '] <font color="green">connected</font></li>'));
        var video = ('<p><span class="glyphicon glyphicon-facetime-video"></span></p>');
        var private = ('<p><span class="glyphicon glyphicon-lock"></span></p> ');
        var div = ('<hr/><div>State: ' + users[i].state + '</div>');
        $("#user").append($("<li><img class='ava' src='" + users[i].img + "'/>" + users[i].nick + video + private + div + "</li>"));
    }
});

socket.on('chat message', function(msg, nick){
    msg = escapeHtml(msg);
    if (msg){
        $('#line').append($('<li class="send"><b>' + nick + "</b>: " + msg + '</li>'));
        console.log(nick);
    }
});
// PRUEBAS PRUEBAS PRUEBAS
socket.on("showUser", function(text, state, img){
    text = escapeHtml(text);
    if (text){
        var video = ('<p><span class="glyphicon glyphicon-facetime-video"></span></p>');
        var private = ('<p><span class="glyphicon glyphicon-lock"></span></p> ');
        var div = ('<hr/><div>State: ' + state + '</div>');
        //$("#user").append($("<li><img class='ava' src='" + img + "'/>" + text + video + private + div + "</li>"));
    }
});