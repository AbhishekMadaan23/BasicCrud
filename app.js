
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/CrudList", {useNewUrlParser: true});

//--------------------------------------------------------------

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
  name: "Welcome to our ToDoList"
});

const item2 = new Item({
  name: "Hit + button to add an item"
});

const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1,item2, item3];
//---------------------------------------------------------------

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = new mongoose.model("User",userSchema);

//------------------------------------------------------------------
app.get("/",function(req,res){
  res.render("Home");
})

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
})

//---------------------------------------------------------------------

app.get("/list", function(req,res){

  Item.find({}, function(err,foundItems){

    if(foundItems.length===0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("successfully inserted");
        }
      });
          res.redirect("/list");
    }

    else{
      res.render("list",{listItems : foundItems});
    }
  })

})

app.post("/delete", function(req, res){

  if(req.body.edit){
    res.redirect("/update");
  }

  else{
  const checkedItemId= req.body.checkbox;


  Item.deleteOne({_id: checkedItemId},function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("checked item successfully deleted");
    }
  })
 res.redirect("/list");
}
})


app.get("/update",function(req,res){


  console.log("update is called");

  res.redirect("/list")

});

app.post("/list", function(req,res){
  const item = req.body.newItem;

  const newItem= new Item({
    name: item
  });
  newItem.save();


  res.redirect("/list");

});
//---------------------------------------------------------------

app.post("/register",function(req , res){

  const newUser= new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/list");
    }
  })

})

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password === password){
          console.log("successfull authentication");
          res.redirect("/list");
        }
      }
    }
  })

})

app.listen(3000, function(res,req){
  console.log("server started at port 3000");
});
