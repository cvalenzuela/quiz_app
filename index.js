/*
=================
Building Web Apps
October 22-2016
Class by Abhishek Singh
Quiz App
=================
*/

/* Require Modules */
var express = require('express');
var http = require('http');

/* Create express and the server */
var app = express(); //Create Express App. Take the variable express and create a function with it
http = http.Server(app); // Create server with express inside it
const BASE = '/';

/* Main Route Function when going to localhost:3000 */
app.get(BASE, function(req, res){ // The browser is goint to send a 'req' to BASE and server sends 'res'
  res.send("Hello ITP");
})

/* Route for About */
app.get(BASE+'about', function (req,res){
  res.send("About");
})

/* Route for Contact */
app.get(BASE+'contact', function (req,res){
  res.send("Contact");
})

/* Start server */
var server = http.listen(3000,function(){
  console.log("Listening on port 3000");
})
