/*  */
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
        
var socket = io();
$('form').submit(function(){
    socket.emit('chat message', $('#text').val());
    $('#text').val('');
    return false;
});

socket.on('chat message', function(msg){
    msg = escapeHtml(msg);
    $('#line').append($('<li>> ' + msg + '</li>'));
});