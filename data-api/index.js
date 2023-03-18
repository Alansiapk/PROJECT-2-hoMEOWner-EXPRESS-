const express = require("express");
//it will look at the .env
//copy all the variables from .env in our OS
const { ObjectId } = require("mongodb");
const MongoUtil = require("./MongoUtil.js");
require('dotenv').config();

//use consts instead of hard-coded strings
const CATCOLLECTION ="catCollection";
const USERCOLLECTION = "userCollection";
const DB = "hoMEOWner";
const MONGO_URI = process.env.MONGO_URI;


//process is always available
//it refers to current program that is running
console.log(process.env)

const app = express();
app.use(express.json());//enable JSON to be sent via POST



async function main() {
    //connect to mongodb we need 2 parameter
    //1st connection string
    //2nd configuration object
    const db = await MongoUtil.connect(MONGO_URI, DB);

    //sanity test to see that our server works(GET)
    //READ
    // app.get("/", async function (req, res) {
    //     //send any data to the server
    //     // res.send("hello world")
    //     //after mongoDB. 
    //     const catCollection = await db.collection(CATCOLLECTION)
    //         .find({})
    //         .limit(20)
    //         .toArray(); //convert an array to objects

    //     console.log(COLLECTION);

    //     //send back to the client in the JSON format
    //     res.json(catCollection);
    // })

    //(READ)retrieve all exisiting data 
    app.get("/catCollection", async function (req, res) {

        //accessing query strings:
        // console.log(req.query)
        const filter = {};

        if (req.query.catName) {
            //add the catname criteria to the filter objeect
            filter.catName = {
                "$regex": req.query.catName,
                "$options": "i" //turn on case sensitive
            }
        }

        //Array filter
        if (req.query.personality) {
            filter.personality = {
                "$in": [req.query.personality]
            }
        }

        console.log(filter)

        const catCollection = await db.collection(CATCOLLECTION).find(filter).toArray();
        console.log("catCollection:", catCollection)
        res.json({
            "catCollection": catCollection
        })
    })

    //add new user use "POST"
    //ensure select JSON in ARC
    //(CREATE: catCollection)
    app.post("/catCollection", async function (req, res) {

        if (!req.body.catName) {
            //we have to tell the client that the name cant be null
            res.status(400);
            res.json({
                "error": "You must provide name"
            });
            return;//end the function
        }
        try {
            const result = await db.collection(CATCOLLECTION)
                .insertOne({
                    "userID": req.body.userID,
                    "catName": req.body.catName,
                    "catAge": req.body.catAge,
                    "catBreed": req.body.catBreed,
                    "catGender": req.body.catGender,
                    "requireHomeVisit": req.body.requireHomeVisit,
                    "neutered": req.body.neutered,
                    "personality": req.body.personality,
                    "familyStatus": req.body.familyStatus,
                    "medicalHistory": req.body.medicalHistory,
                    "pictureUrl": req.body.pictureUrl,
                    "adopted": req.body.adopted
                });
            //send back result so the client
            //knows whetehr it is success or not
            //and what the ID of the new document is
            res.json({
                "status": result
            });
        } catch (e) {
            res.status(503);
            res.json({
                "error": "Database not available. Please try later"
            }) //added validation to the create
        }
    })

    //(CREATE: userCollection)
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
            const result = await db.collection(USERCOLLECTION)
                .insertOne({
                    "name": req.body.name,
                    "dateOfBirth": req.body.dateOfBirth,
                    "address": req.body.address,
                    "contactNumber": req.body.contactNumber,
                    "email": req.body.email,
                    "catList": req.body.catList,
                });
            //send back result so the client
            //knows whetehr it is success or not
            //and what the ID of the new document is
            res.json({
                "status": result
            });
        } catch (e) {
            res.status(503);
            res.json({
                "error": "Database not available. Please try later"
            }) //added validation to the create
        }
    })

    //(UPDATE)modify a document
    app.put("/catCollection/:cat_id", async function (req, res) {
        //the data will in req.body
        const catId = req.params.cat_id;
        
        //the data will in req.body

        const response = await db.collection(CATCOLLECTION)
            .updateOne({
                "_id": new ObjectId(catId)
            }, {
                "$set": {
                    "userID": req.body.userID,
                    "catName": req.body.catName,
                    "catAge": req.body.catAge,
                    "catBreed": req.body.catBreed,
                    "catGender": req.body.catGender,
                    "requireHomeVisit": req.body.requireHomeVisit,
                    "neutered": req.body.neutered,
                    "personality": req.body.personality,
                    "familyStatus": req.body.familyStatus,
                    "medicalHistory": req.body.medicalHistory,
                    "pictureUrl": req.body.pictureUrl,
                    "adopted": req.body.adopted
                }
            });
        res.json({
            "status": response
        })

    })

    //(DELETE)
    app.delete("/catCollection/:cat_id",async function(req,res){
        const result = await db.collection (CATCOLLECTION).deleteOne({
            "_id":new ObjectId(req.params.cat_id)
        })
        res.json({
            "status": "ok",
            "result": result
        })
    });

}

main();


//write listen first. so that we can ensure theroute goes before
app.listen(3000, function () {
    console.log(`server has started on port http://localhost${3000}`)
})

//then $ npm install -g nodemon
//then nodemon
