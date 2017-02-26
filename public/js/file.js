$('#selectedFile').on('change', function(e){
    var file = e.originalEvent.target.files[0];
    var reader = new FileReader();
    
    reader.onload = function(evt){
        socket.emit('sendImage', evt.target.result);
    };
    reader.readAsDataURL(file);
    
    $('#selectedFile').val("");
});