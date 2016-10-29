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
var http = require('http');
var path = require('path'); // Helps finds path to things

/* Create express and the server */
var app = express(); //Create Express App. Take the variable express and create a function with it
http = http.Server(app); // Create server with express inside it
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

/*== Client Calls ===*/



/*== Start server ==*/
var server = http.listen(3000,function(){
  console.log("Listening on port 3000");
})
/*== Start server ==*/
