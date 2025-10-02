// server.mjs
var express = require("express");
var my_files = require("fs");
var MongoClient = require("mongodb");
var formidable = require('formidable');
var cors = require("cors")

var app = express();

app.use(cors());

// decode json
app.use(express.json());

// url to connect to mongo db cloud server
var mongo_url = "mongodb+srv://peebles:Fabulae1!@cluster-1.ktrcib2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-1";

// the client to mongo db for further actions on our cloud server
var client = new MongoClient.MongoClient(mongo_url);

var db, collection;

async function connecttodatabase(){
    try{
        // await so we wait for the connection to be build.
        await client.connect();
        db = client.db("class_assignment_db");
        collection = db.collection("class_assignment_collection");
        console.log("Connected to the mongo db server online!");
    }
    catch(error){
        console.log("An error has happened with mongo db connection: ", error)
    }
}

// define route

app.get("/", (req,res)=>{
    my_files.readFile("home.html", function(err, data){

        if (err){
            console.log(err);
        }
        else{
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }

    });
});

app.get("/contact", (req,res)=>{
    my_files.readFile("contact.html", function(err, data){

        if (err){
            console.log(err);
        }
        else{
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }

    });
});

app.get("/aboutus", (req,res)=>{
    my_files.readFile("aboutus.html", function(err, data){

        if (err){
            console.log(err);
        }
        else{
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
        

    });
});

app.post("/mongo_data",  (req, res) => {
    // var data = req.body;
    var my_multiple_data = [{
        u_name : "Abc2",
        u_age: 42,
        u_car: "Honda Civic",
        u_color: "yellow"
    },
    {
        u_name : "Abc3",
        u_age: 43,
        u_car: "Bugatti",
        u_color: "red"
    },
    {
        u_name : "Abc4",
        u_age: 44,
        u_car: "Toyota Corrola",
        u_color: "blue"
    },
    {
        u_name : "Abc5",
        u_age: 45,
        u_car: "Scion Tc",
        u_color: "pink"
    }
    ]
    var result =  collection.insertMany(my_multiple_data);
    res.send("Data saved")
});

app.get("/get_one_data", async (req, res) => {
    var data_from_mongo = await collection.findOne();
    res.send(data_from_mongo);
});

app.get("/get_many_data", async (req, res) => {
    var all_data_from_mongo = await collection.find();
    var result_final_data = await all_data_from_mongo.toArray();
    res.send(result_final_data);
});

app.get("/get_filtered_data", async (req, res) => {
    var my_filter = {user_car:"BMW", user_age:40}
    var all_data_from_mongo = await collection.find(my_filter);
    var result_final_data = await all_data_from_mongo.toArray();
    res.send(result_final_data);
});

app.get("/delete_one_data", (req, res) => {
    var my_filter = {u_name:"Test4"}
    var delete_one_data = collection.deleteOne(my_filter);
    res.send("Data Deleted");
});

app.get("/delete_multiple_data", (req, res) => {
    var my_filter = {u_name:"Test4"}
    var delete_one_data = collection.deleteMany(my_filter);
    res.send("Data Deleted");
});

// // deletes all the data from a collection
// app.get("/delete_all_data", (req, res) => {
//     var delete_one_data = collection.deleteMany();
//     res.send("Data Deleted");
// });

app.get("/update_one_doc", (req, res) => {
    var my_filter = {u_name:"Test3"}
    var my_update_set = {$set:{u_age:50, user_var:"Bugatti", }}
    var update_one_data = collection.updateOne(
        my_filter,
        my_update_set
    );
    res.send("Data Updated");
});

app.get("/update_many_docs", (req, res) => {
    var my_filter = {u_name:"Test3"}
    var my_update_set = {$set:{u_age:55, user_car:"Honda Civic", }}
    var update_many_data = collection.updateMany(
        my_filter,
        my_update_set
    );
    res.send("All Data Updated");
});

// this approach adds the data if it cannot ind/filter the data
app.get("/either_update_or_insert", (req, res) => {
    var my_filter = {u_name:"Test4"}
    var my_update_set = {$set:{u_age:20, user_car:"Coding", }}
    var update_one_data = collection.updateOne(
        my_filter,
        my_update_set,
        {upsert:true}
    );
    res.send("Data Updated");
});


app.post("/send_to_mongo", async (req, res) => {
    // read the incoming file data
    var form = await new formidable.IncomingForm();

    // extract data and create our own object to store into mongo db
    form.parse(req, async function (err, fields, files) {
        var my_form_data = {
            User_name: fields.u_name[0],
            User_age: fields.u_age[0],
            User_car: fields.u_car[0],
            User_color: fields.u_color[0]
        }
        // store our object to mongo db
        var result =  await collection.insertOne(my_form_data);
    })
    res.send("Data saved")
});

app.post("/data_from_react", async (req, res) => {
    // read the incoming file data
    var my_req_body = req.body;
    // var form = await new formidable.IncomingForm();
    db = client.db("class_assignment_db");
    collection = db.collection("class_assignment_collection");

    var my_form_data = {
            user_name: my_req_body.u_name,
            user_age: my_req_body.u_age,
            user_car: my_req_body.u_car,
            user_color: my_req_body.u_color
        }
        // store our object to mongo db
        var result =  await collection.insertOne(my_form_data);
    res.send("Data saved")
});

// get all data from our choice of db and collection
app.get("/get_all_user_data", async (req, res) => {
    db = client.db("class_assignment_db");
    collection = db.collection("class_assignment_collection");
    var all_data_from_mongo = await collection.find();
    var result_final_data = await all_data_from_mongo.toArray();
    res.send(result_final_data);
});


app.get("/get_filtered_user", (req, res) => {
    my_files.readFile("find.html", function(err, data){

        if (err){
            console.log(err);
        }
        else{
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }

    });
} );

app.post("/filter_based_on_user_name", async (req, res) => {
    // read the incoming file data
    var form = await new formidable.IncomingForm();

    // extract data and create our own object to store into mongo db
    form.parse(req, async function (err, fields, files) {
        var my_form_filter = {
            User_name: fields.u_name_flitered[0]
        }

        // find the data
        var result =  await collection.find(my_form_filter);
        var result_final_data = await result.toArray();
        res.send(result_final_data);
    })
});

app.post("/filter_based_on_user_car", async (req, res) => {
    // read the incoming file data
    var form = await new formidable.IncomingForm();

    // extract data and create our own object to store into mongo db
    form.parse(req, async function (err, fields, files) {
        var my_form_filter = {
            User_car: fields.u_car_flitered[0]
        }

        // find the data
        var result =  await collection.find(my_form_filter);
        var result_final_data = await result.toArray();
        res.send(result_final_data);
    })
});


connecttodatabase().then(() => {

    app.listen(8000, ()=>{
        console.log("The express JS server has started.");
    });

}  )