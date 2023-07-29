const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

//const date = require(__dirname+"/date.js");


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://Admin-Harsh:harshkr12@todolist.rmg3qta.mongodb.net/todolist");

const listSchema = new mongoose.Schema({
    newItem: {
        type:String,
        required:true
    }

});

const newListSchema= new mongoose.Schema({
    Name: {
        type:String,
        required:true
    },
    Item:[listSchema]
})

const List = mongoose.model("item", listSchema);

const NewItem = mongoose.model("list", newListSchema);

var item1 = new List({
    newItem: "Attend classes"
});

var item2 = new List({
    newItem:"2 hrs of gym"
});

var item3 = new List({
    newItem:"2 hrs of coding"
});

var itemArray = [item1, item2,item3];


app.get("/",function(request , response){
   
    //var dayName= date();
    List.find({}).then(array=>{
        if(array.length===0){
            List.insertMany(itemArray);
            console.log("items added successfully!");
            response.redirect("/");
        
        }
        else{
        response.render("index",{ListTitle:"Today", newListItem:array});
        }
    });
    })

app.post("/",function(request,response){
    if(request.body.listType==="Today"){
        var item = request.body.newItem;
        addItem = new List({
            newItem: item
        });
        addItem.save();
        response.redirect("/");
    }
    else{
        NewItem.findOne({Name:request.body.listType}).then(data=>{
            var item = new List({
                newItem:request.body.newItem
            });
            data.Item.push(item);
            data.save();
            response.redirect("/"+request.body.listType);
        })
    }
    
})

app.post("/delete",function(req,res){

    if(req.body.ListName==="Today"){
        var toDelete = req.body.Checkbox;
    List.findByIdAndRemove(toDelete).then(deleted=>{
        console.log("successfully deleted!");
    });
    res.redirect("/");
    }
    else{
        NewItem.findOneAndUpdate({Name:req.body.ListName},{$pull:{Item:{_id:req.body.Checkbox}}}).then(data=>{
            if(data){
                console.log("Removed");
            }
        })
        res.redirect("/"+req.body.ListName);
    }
    
})




app.get("/:customRoute",function(req,res){
    var listName = _.capitalize(req.params.customRoute);
    NewItem.findOne({Name:listName}).then(data=>{
        if(data){
            if(data.Name===listName){
                res.render("index",{ListTitle:data.Name, newListItem:data.Item});
            }
        }

        if(!data){
            var NewList = new NewItem({
                Name: listName,
                Item:itemArray
            })

            NewList.save();
            res.render("index",{ListTitle:NewList.Name, newListItem:NewList.Item});
            console.log("created");
        }
    }).catch(err=>{
        console.log(err);
    })

})
       


app.listen(process.env.PORT || 3000,function(request,response){
    console.log("The server is working at port 3000");
})






























/*

NewItem.findOne({Name:req.params.customRoute}).then(array=>{
        if(array.Name===req.params.customRoute){
            console.log("exists");
            res.render("index",{ListTitle:array.Name, newListItem:array.Item});
        }
        else{
            var NewList = new NewItem({
                Name: req.params.customRoute,
                Item:itemArray
            })

            NewList.save();
            res.render("index",{ListTitle:NewList.Name, newListItem:NewList.Item});
            console.log("created");
    
        }
    })


*/

