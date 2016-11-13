

$(document).ready(function(){

  console.log("frontend js loaded, we are ready to go");

  var socket = io();

  // When connection with server is establish, emit this
  socket.emit("newClientMessage", "hi this is cat client, nice to meet you");

  // Listen when a "resend" is emitted from server
  socket.on("resend", function(content){
    console.log(content);
  });

  // Listen when the "#socket" div is clicked,
  $("#socket").on('click', function(){
    // When it is, emit this message
    socket.emit("click", "hello this is cat"); // Send it as 'click'
  });

  // Listen when the submit button is clicked
  $("#chat").on('submit', function(event){  // Event (that could be called anything), allows from moving to another page when clicked
    event.preventDefault(); // Here it happens, we prevent the default action of the button event in form

    var message = $("#chat-message").val();  // get the value of the chat message
    socket.emit("chat", message);
  });

  // Append the message from the chat sent.
  socket.on('outgoing-message', function(data){ // listen for outgoing-message
    var list = $("<li>"+data+"</li>");
    $("#chat-messages").append(list);
  });
})

  // AJAX: Access the form with id "user"
  $('#user').on('sumbit', function(event){

    event.preventDefault(); // Preven the dafualto action of the form = send to another page

    var inputValue = $("#username").val();

    $.ajax({
      url : '/newuser',
      method : 'post',
      data : {
        name : inputValue
      }
    })
    .done(function(response){
      alert(response);
    })
    .fail(function(error){

    })
  })

  $("#gif").on('submit', function(event){
    event.preventDefault();
    var query = $("#gif-value").val();
    $.ajax({
      url: '/search/' + query ,
      method: 'get'
    })
    .done(function(response){
        var img = $("<li><img src='"+response+"'/></li>");
        $("#chat-messages").append(img)
    })
  })
