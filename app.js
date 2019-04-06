//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const date = require(__dirname + '/date.js');

const listItems = [];
const workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

app.get("/", function(req, res){
  let day = date.getDate();
    res.render('list',{title : day, newListItems: listItems});


});



app.post("/", function(req, res){
  let item = req.body.list_item;
  console.log(item);
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

// work page liste
app.get("/work", function(req, res){
  let title = "Work List";
  res.render('list', {title : title, newListItems: workItems});

});

app.post("/work", function(req, res){
  let item = req.body.list_item;
  console.log(item);
  workItems.push(item);
  console.log(workItems);
    res.redirect("/work");
});

//about page list

app.get("/about", function(req, res){
  res.render('about', {pageTitle: 'About Us'});
});


app.listen(3000, function(){
  console.log("The server is running on http://localhost:3000");
});
