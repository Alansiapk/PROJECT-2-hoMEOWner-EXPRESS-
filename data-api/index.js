const express = require("express");
//it will look at the .env
//copy all the variables from .env in our OS
require('dotenv').config();

//process is always available
//it refers to current program that is running
console.log(process.env)

const app = express();
app.use(express.json());//enable JSON to be sent via POST

//for express to talk to mongo, liskewise we need a client
//but this client is for nodejs
const MongoClient = require("mongodb").MongoClient;

async function main() {
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
    app.get("/", async function (req, res) {
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

    //add new user use "POST"
    //ensure select JSON in ARC
    app.post("/userCollection", async function (req, res) {

        if (!req.body.name) {
            //we have to tell the client that the name cant be null
            res.status(400);
            res.json({
                "error": "You must provide name"
            });
            return;//end the function
        }
        try {
            const result = await db.collection("userCollection")
                .insertOne({
                    "name": req.body.name,
                    "dateOfBirth": req.body.dateOfBirth,
                    "address": req.body.address,
                    "contactNumber": req.body.contactNumber,
                    "email": req.body.email
                });
            //send back result so the client
            //knows whetehr it is success or not
            //and what the ID of the new document is
            res.json({
                "status": result
            });
        } catch(e){
            res.status(503);
            res.json({
                "error":"Database not available. Please try later"
            }) //added validation to the create

        }

    })


}

main();


//write listen first. so that we can ensure theroute goes before
app.listen(3000, function () {
    console.log(`server has started on port http://localhost${3000}`)
})

//then $ npm install -g nodemon
//then nodemon
