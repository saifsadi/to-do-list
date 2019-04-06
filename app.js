//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//added new modules by using require method
const date = require(__dirname + '/date.js');

// when using const in array, you can easily push the new items but not assign a complete new array
const listItems = [];
const workItems = [];

//this is the method to use ejs templ
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

// public means inside this folder, server can treat the files as public, so we can easily embed our css, images etc
app.use(express.static('public'));

// our home route
app.get("/", function(req, res){
  // date.getDate is from Date.js Module
  let day = date.getDate();

    //by using render method, you can send values to the ejs templ
    res.render('list',{title : day, newListItems: listItems});


});


// post route to get the values of the list items and save them
app.post("/", function(req, res){
  let item = req.body.list_item;
  console.log(item);

  //when u console req.body then you 'll get two valuse, one is text input and other is button, so we have set the
  //value of button as ejs title, and by using if condition we can append the data to specific list, main list or work list
  if(req.body.list == "Work"){
    workItems.push(item);
    res.redirect("/work");
  }
  else {
    listItems.push(item);
    console.log(req.body);
      res.redirect("/");
  }
});

// work page list route
app.get("/work", function(req, res){
  let title = "Work List";
  res.render('list', {title : title, newListItems: workItems});

});

//work list page post
app.post("/work", function(req, res){
  let item = req.body.list_item;
  console.log(item);
  workItems.push(item);
  console.log(workItems);
    res.redirect("/work");
});

//about page ejs

app.get("/about", function(req, res){
  res.render('about', {pageTitle: 'About Us'});
});


app.listen(3000, function(){
  console.log("The server is running on http://localhost:3000");
});
