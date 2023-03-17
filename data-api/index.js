const express = require("express");
//it will look at the .env
//copy all the variables from .env in our OS
require('dotenv').config();

//process is always available
//it refers to current program that is running
console.log(process.env)

const app = express();

//for express to talk to mongo, liskewise we need a client
//but this client is for nodejs
const MongoClient = require ("mongodb").MongoClient;

async function main (){
//connect to mongodb we need 2 parameter
//1st connection string
//2nd configuration object
const client = await MongoClient.connect(process.env.MONGO_URI, {
    "useUnifiedTopology": true //simplify our access to Monogo
});

//get a hoMEOWner database
//store it in the db variable
const db = client.db("hoMEOWner");

//sanity test to see that our server works
app.get("/", async function(req,res){
    //send any data to the server
    // res.send("hello world")
    //after mongoDB. 
    const userCollection = await db.collection("userCollection")
    .find({})
    .limit(20)
    .toArray(); //convert an array to objects

    console.log(userCollection);

    //send back to the client in the JSON format
    res.json(userCollection);
})   
}

main ();


//write listen first. so that we can ensure theroute goes before
app.listen(3000,function(){
    console.log(`server has started on port http://localhost${3000}`)
})

//then $ npm install -g nodemon
//then nodemon
