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
            }
            else{
                $(".errorUser").html("Sorry, that user is taken, try other user");
            }
        });
    }
}

$(function(){
    $("#myModal").modal('show');
    $("input").focus();
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
        $("#user").append($("<li><img class='ava' src='" + users[i].img + "'/>" + users[i].nick + video + private + div + "</li>"));
    }
});

socket.on('chat message', function(msg, nick, id){
    msg = escapeHtml(msg);
    if (msg && socket.id == id){
        $('#line').append($('<li class="send"><b>' + nick + "</b>: " + msg + '</li>'));
    }
    if (msg && socket.id != id){
        $('#line').append($('<li class="other"><b>' + nick + "</b>: " + msg + '</li>'));
    }
});

socket.on("delUser", function(nick){
    if (!nick){return;} //For when reload the page without login.
    
    $('#line').append($('<li class="new">User <b>' + nick + '</b><font color="red">disconnected</font></li>'));
});

socket.on("showUser", function(nick){
    $('#line').append($('<li class="new">User <b>' + nick + ' </b><font color="green">connected</font></li>'));
});