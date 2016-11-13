/*
=================
Building Web Apps
October 22,29-2016
Class by Abhishek Singh
Quiz App
=================
*/

/* Require Modules */
var express = require('express'); // Express knows where is pug, so we dont need to import pug
var app = express(); //Create Express App. Take the variable express and create a function with it
var http = require('http');
http = http.Server(app); // Create server with express inside it
var path = require('path'); // Helps finds path to things
var bodyParser = require('body-parser');
var giphy = require('giphy-api')(); // Require Giphy Api
var io = require('socket.io')(http);
/* Create express and the server */

const BASE = '/';

/* Database with Mongoose */
var mongoose = require('mongoose');
mongoose.connect("mongodb://admin:6424.uai@ds045628.mlab.com:45628/itp-dbexample"); // Connnect to DB
var db = mongoose.connection; // Check for working connection. Only after mongoose.connect

/* Callback for Database*/
db.on('open', function(){ // When the db variables has a 'open' will call the funciton
  console.log("I have connected to the database.");
})

/* Create a Schema (definition of what is inside the fields in the db) */
var Schema = mongoose.Schema; // Import the Schema Object from Mongoose Module
var userSchema = new Schema({
  name: {
    type: String,
    trim: true   // dont save the white spaces if someone writes something like "    juan      "
  },
  email:{
    type: String,
    trim: true
  }
})

var User = mongoose.model('User', userSchema); // Create a user model based on the userSchema





/*== Middleware, require before responds in sent (in between req and res) ==*/
/*Use Pug for HTML Templeting*/
app.set('views', path.join(__dirname, 'views')) // Append the directory to views, since is Middleware the path is different from the client part
app.set('view engine','pug'); // View engine to render the page.

app.use(express.static(path.join(__dirname, 'public')));

// Bodyparser call
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

/*== Middleware, require before responds in sent (in between req and res) ==*/





/* ==== Client Calls ==== */

/* Main Route Function when going to localhost:3000 */
app.get(BASE, function(req, res){ // The browser is goint to send a 'req' to BASE and server sends 'res'
  //res.send("<h1>Hello ITP</h1>"); // Send plain text
  var name = "Cristobal";
  // From this we could do something like:
  // get name form database
  // add first name and last name
  // set it to a variable
  // pass that variable to the template
  res.render("index.pug", {myname:name}) // Render index pug file and pass the variable myname
})

/* Route for About */
app.get(BASE+'about', function (req,res){

  var list = ["chris", "leslie", "diego", "juan"];
  var meeting = false;

  //res.send("About page");
  res.render("about.pug", {namelist:list, is_meeting_on:meeting}); // Render about pug file
})

/* Route for Contact */
app.get(BASE+'contact', function (req,res){
  //res.send("Contact");
})


/*--- Database based Calls  ---*/

/* First: Route for the Database that Adds a new user everytime we acces /user */
app.get(BASE+'user', function(req,res){

  var newUser = new User({
    name: "juan"    // Pass a value according to the schema we defined
  })

  newUser.save(function(err, result){ // When the new user gets saved run this function. This will create a new user everytime we access /user

    if(err){
      console.log(err);
      res.send("Error saving your name");
    }else{
      res.send("Saved to database");
    }
  })

})

/* Second: Show all saved users in the database */
app.get(BASE+'all', function(req,res){
  User.find({}, function(err, results){ // Within the "User Schema" find everything

    if(err){
      res.send("cannot find everything");
    }

    return res.json(
      {
      data: results
      }
    )
  })
})

/* Third: Query the database: only shows something specific. In this case "cristobal" */
app.get(BASE+'filter', function(req, res){
  User.find({name: "cristobal"}, function(err, result){
    return res.json(
      {
        data: result
      }
    )
  })
})

/* Fourth: Giphy API */
app.get(BASE+'gif', function(req,res){ // res = the result to the client
  giphy.search('potato', function(err,result){ // result = the result from the query
    var random = Math.floor(Math.random()*result.data.length);
    var image = result.data[random].images.fixed_height.url;
    //res.json(result.data[1].images.fixed_height.url);
    res.send("<img src='"+image+"' />'")
  });
})

/* Fifth: Giphy API version 2: a hard way of getting a specifi image writing it to the directly to the url */
app.get(BASE+'gify', function(req,res){

  var searchQuery = req.query.search; // return the string input in the url in the form localhost:300/gif?search=potato => potato


  giphy.search(searchQuery, function(err,result){
    var random = Math.floor(Math.random()*result.data.length);
    var image = result.data[random].images.fixed_height.url;
    res.send("<img src='"+image+"' />'")
  });
})

app.get(BASE+'search/:searchValue', function(req,res){ // Including a varible into a route with :searchValue

  var searchQuery = req.params.searchValue;

  giphy.search(searchQuery, function(req, result){
    var random = Math.floor(Math.random()*result.data.length);
    // var image = result.data[random].images.fixed_height.url;
    // res.send("<img src='"+image+"' />'")
    res.send(result.data[random].images.fixed_height.url);
  })

})

/* When the post form with a name is completed and the button is clicked,  "New User" is called */
app.post(BASE+'newuser', function(req, res, next){

  //var newname = req.body.username  // retrieve the username type in the form
  var newname = req.body.name

  var newuser = new User({  // Save the object to new User object
    name: newname
  })

  newuser.save(function(err, result){

    if(err){
      res.send("Could not save")
    }
    else{
      res.send("Saved to database")
    }
  })

})
/*== Client Calls ===*/

/*== Socket ===*/
// on = receive something
// emit = send something
io.on('connection', function(socket){ // when a client connects, there will be assigned "socket" and everything inside here will be "open and waiting"

  // When a connection is establish, send this message
  console.log("hi this is dog server and I just saw that a new cat is connected ");

  // Listen for a newClientMessage emit function from client
  socket.on("newClientMessage", function(data){  // In the front-end there's a message called newClientMessage, so here we wait for it.
    console.log(data);
    socket.emit("resend", data); // send just back to the client (socket.emit)
  });

  // Listen for a click emit function
  socket.on("click", function(data){
    console.log(data);
  });

  // Listen for a chat emit function
  socket.on("chat", function(data){
    // Send back the same msg received in the chat
    io.emit("outgoing-message", data) // send to every client (io.emit) that is currently connect and has a tunel open
  });

})
/*== Socket ===*/

/*== Start server ==*/
var server = http.listen(3000,function(){
  console.log("Listening on port 3000");
})
/*== Start server ==*/
