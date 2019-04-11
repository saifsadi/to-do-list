//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
//added new modules by using require method


// when using const in array, you can easily push the new items but not assign a complete new array
const listItems = [];
const workItems = [];

//this is the method to use ejs templ
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

// public means inside this folder, server can treat the files as public, so we can easily embed our css, images etc
app.use(express.static('public'));


mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true
});

const itemSchema = {
  item: String
};

const Item = mongoose.model("Item", itemSchema);
const Work = mongoose.model("Work", itemSchema);

const item1 = new Item({
  item: "Something to do"
});

const item2 = new Item({
  item: "This is the item 2"
});

const item3 = new Item({
  item: "This is the item 3"
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Default items were added");
//   }
// });



// our home route
app.get("/", function(req, res) {
  // date.getDate is from Date.js Module

  Item.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length == 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Default items were added");
          }
        });
        res.redirect("/");
      } else {
        //by using render method, you can send values to the ejs templ
        res.render('list', {
          title: "Today",
          newListItems: result
        });
      }

    }
  });




});


// post route to get the values of the list items and save them
app.post("/", function(req, res) {
  let list_item = req.body.list_item;
  console.log(list_item);


  //when u console req.body then you 'll get two valuse, one is text input and other is button, so we have set the
  //value of button as ejs title, and by using if condition we can append the data to specific list, main list or work list
  if (req.body.list == "Work") {
    workItems.push(list_item);
    const newWork = new Work (
      {
        item : list_item
      }
    );

    newWork.save();
    res.redirect("/work");
  } else {

    const newItem = new Item (
      {
        item : list_item
      }
    );

    newItem.save();

    listItems.push(list_item);
    console.log(req.body);
    res.redirect("/");
  }
});

//delete items route
app.post("/delete", function(req, res){
  console.log(req.body.checkbox);
  console.log(req.body.list);
  if(req.body.list == 'Today'){

    Item.deleteOne({_id : req.body.checkbox}, function(err){
      if(err){
        console.log(err);
      } else {
        console.log("Sucessfully Deleted");
      }
    });
    res.redirect("/");
  } else {
    Work.deleteOne({_id : req.body.checkbox}, function(err){
      if(err){
        console.log(err);
      } else {
        console.log("Sucessfully Deleted");
      }
    });
    res.redirect("/work");
  }

});

// work page list route
app.get("/work", function(req, res) {
let title = "Work";
  Work.find({},function(err, result){
    res.render('list', {
      title: title,
      newListItems: result
    });
  });

});

//work list page post
app.post("/work", function(req, res) {
  let list_item = req.body.list_item;
  const newWork = new Work (
    {
      item : list_item
    }
  );

  newWork.save();

  //console.log(item);
  //workItems.push(item);
  //console.log(workItems);
  res.redirect("/work");
});

//about page ejs

app.get("/about", function(req, res) {
  res.render('about', {
    pageTitle: 'About Us'
  });
});


app.listen(3000, function() {
  console.log("The server is running on http://localhost:3000");
});
