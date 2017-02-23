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
        $("#myModal").modal('hide');
        
        socket.emit('showUser', val, state, img);
        socket.emit("addUser", val);
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
    socket.emit('chat message', $('#text').val(), "send");
    $('#text').val('');
    return false;
});

socket.on("delUser", function(){
    $('#line').append($('<li class="new">Usuario <font color="red">desconectado</font></li>'));
});

socket.on("addUser", function(user){
    $('#line').append($('<li class="new">Usuario [' + user + '] <font color="green">conectado</font></li>'));
});

socket.on('chat message', function(msg, cls){
    msg = escapeHtml(msg);
    if (msg){
        $('#line').append($('<li class="' + cls + '"><b>' + socket.nick + "</b>: " + msg + '</li>'));
        console.log(socket.nick);
    }
});

socket.on("showUser", function(text, state, img){
    text = escapeHtml(text);
    if (text){
        var video = ('<p><span class="glyphicon glyphicon-facetime-video"></span></p>');
        var private = ('<p><span class="glyphicon glyphicon-lock"></span></p> ');
        var div = ('<hr/><div>State: ' + state + '</div>');
        $("#user").append($("<li><img class='ava' src='" + img + "'/>" + text + video + private + div + "</li>"));
    }
});