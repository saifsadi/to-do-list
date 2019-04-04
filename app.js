//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
let list_item = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

app.get("/", function(req, res){
  let options = {
    weekday : 'long',
    year : 'numeric',
    month : 'long',
    day : 'numeric'
  };

  //var DayList = ['Sunday', 'Monday' , 'Tuesday', 'Wedensday', 'Thursday', 'Friday', 'Satureday'];
  let today = new Date();
  let day = today.toLocaleDateString("en-US", options);
  let currentDay = today.getDay();
    res.render('list',{weekDay : day, newListItems: list_item});


});

app.post("/", function(req, res){
  let item = req.body.list_item;
  console.log(item);
  list_item.push(item);
  console.log(list_item);
    res.redirect("/");
});


app.listen(3000, function(){
  console.log("The server is running on http://localhost:3000");
});
