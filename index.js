/*
=================
Building Web Apps
October 22-2016
Class by Abhishek Singh
Quiz App
=================
*/

/* Require Modules */
var express = require('express'); // Express knows where is pug
var http = require('http');
var path = require('path'); // Helps finds path to things

/* Create express and the server */
var app = express(); //Create Express App. Take the variable express and create a function with it
http = http.Server(app); // Create server with express inside it
const BASE = '/';


/*== Middleware, require before responds in sent (in between req and res) ==*/
/*Use Pug for HTML Templeting*/
app.set('views', path.join(__dirname, 'views')) // Append the directory to views, since is Middleware the path is different from the client part
app.set('view engine','pug'); // View engine to render the page.

app.use(express.static(path.join(__dirname, 'public')));
/*== Middleware, require before responds in sent (in between req and res) ==*/



/*== Client call ===*/
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
/*== Client call ===*/






/*== Start server ==*/
var server = http.listen(3000,function(){
  console.log("Listening on port 3000");
})
/*== Start server ==*/
