var canvas = document.getElementById("preview");
var context = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 300;
context.width = canvas.width;
context.height = canvas.height;

var video = document.getElementById("video");

var socket = io();

function loadCam(stream){
    video.src = window.URL.createObjectURL(stream);
}

function viewVideo(video, context){
    context.drawImage(video, 0, 0, context.width, context.height);
    socket.emit("stream", canvas.toDataURL("image/webp"));
}

$(function(){
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msgGetUserMedia);
    
    if(navigator.getUserMedia){
        navigator.getUserMedia({video: true}, loadCam, function(){
            alert("Your webcam is disabled, you must activate webcam if you want see another users on video");
        });
    }
    
    setInterval(function(){
        viewVideo(video, context)
    }, 1000);
});