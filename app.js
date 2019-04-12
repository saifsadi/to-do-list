//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

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

const listSchema = {
  name : String,
  items : [itemSchema]
};

const List = mongoose.model("List", listSchema);


const Item = mongoose.model("Item", itemSchema);


const item1 = new Item({
  item: "Welcome to your todo List"
});

const item2 = new Item({
  item: "Hit + button to add new item"
});

const item3 = new Item({
  item: "<-- Hit this to delete the item"
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
  let listItem = req.body.list_item;
  let listName = req.body.list;

  const newItem = new Item (
    {
      item : listItem
    }
  );

  if(listName == "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name : listName}, function(err, foundList){
      foundList.items.push(newItem);
      foundList.save();

      res.redirect("/" + listName);
    });
  }
});

//delete items route
app.post("/delete", function(req, res){
  console.log(req.body.checkbox);
  console.log(req.body.list);
  const checkedItem = req.body.checkbox;
  const listName = req.body.list;

  if(listName == 'Today'){

    Item.deleteOne({_id : checkedItem}, function(err){
      if(err){
        console.log(err);
      } else {
        console.log("Sucessfully Deleted");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items : {_id : checkedItem}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }

});


app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  console.log(customListName);
  List.findOne({name : customListName}, function(err, foundList){
    if(foundList) {
    res.render("list", {title: foundList.name , newListItems: foundList.items});
    } else {
      const newList = new List ({
          name : customListName,
          items : defaultItems
        });

      newList.save();
      res.redirect("/" + customListName);
    }
  });



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
