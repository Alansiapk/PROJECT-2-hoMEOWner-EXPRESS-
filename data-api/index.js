const express = require("express");
//it will look at the .env
//copy all the variables from .env in our OS
const { ObjectId } = require("mongodb");
const MongoUtil = require("./MongoUtil.js");
require('dotenv').config();
//Cross-Origin Resource Sharing //npm i cors
const cors = require("cors");



//use consts instead of hard-coded strings
const CATCOLLECTION = "catCollection";
const USERCOLLECTION = "userCollection";
const REHOMEPOST = "rehomePost";
const DB = "hoMEOWner";
const MONGO_URI = process.env.MONGO_URI;

//process is always available
//it refers to current program that is running
//console.log(process.env)

const app = express();
app.use(express.json());//enable JSON to be sent via POST
app.use(cors())

const validNameSimple = (str) => {
    if (str === "") {
        return false
    } else {
        return true
    }
}

const validCatName = (str) => {

    if (str.trim().length < 4) {
        return false;
    } else {
        return true;
    }
}
 
const validCatAge = (str) => {
    let nAge = Number(str.trim());
    return !isNaN(nAge);
}

async function main() {
    //connect to mongodb we need 2 parameter
    //1st connection string
    //2nd configuration object
    const db = await MongoUtil.connect(MONGO_URI, DB);

    //(READ)catCollection retrieve all exisiting data 
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

        // breed

        if (req.query.catBreed) {
            //add the catname criteria to the filter objeect
            filter.catBreed = {
                "$regex": req.query.catBreed,
                "$options": "i" //turn on case sensitive
            }
        }

        if (req.query.catGender) {
            //add the catname criteria to the filter objeect
            filter.catGender = {
                "$regex": req.query.catGender,
                "$options": "i" //turn on case sensitive
            }
        }

        if (req.query.requireHomeVisit) {
            //add the catname criteria to the filter objeect
            filter.requireHomeVisit = {
                "$regex": req.query.requireHomeVisit,
                "$options": "i" //turn on case sensitive
            }
        }

        if (req.query.neutered) {
            //add the catname criteria to the filter objeect
            filter.neutered = {
                "$regex": req.query.neutered,
                "$options": "i" //turn on case sensitive
            }
        }

        //Array filter
        if (req.query.personality) {
            filter.personality = {
                "$in": [req.query.personality]
            }
        }

        //console.log(filter)

        const catCollection = await db.collection(CATCOLLECTION).find(filter).toArray();
        //console.log("catCollection:", catCollection)
        res.json({
            "catCollection": catCollection
        })
    })

    //(READ)rehomePost retrieve all exisiting data 
    app.get("/rehomePost", async function (req, res) {

        const rehomePost = await db.collection(REHOMEPOST).find({}).toArray();
        //console.log("rehomePost:", rehomePost)
        res.json({
            "rehomePost": rehomePost
        })
    })

    //(READ)userCollection retrieve all exisiting data 
    app.get("/userCollection", async function (req, res) {

        const userCollection = await db.collection(USERCOLLECTION).find({}).toArray();
        //console.log("userCollection:", userCollection)
        res.json({
            "userCollection": userCollection
        })
    })


    //if create medicalHistory comment for an existing catCollection,
    //updateOne,"$push", 
    app.post("/catCollection/:cat_id/medicalHistory", async function (req, res) {
        //adding medicalHistory comment to the cat id equal to req.params.cat
        const result = await db.collection(CATCOLLECTION).updateOne({
            "_id": new ObjectId(req.params.cat_id)
        }, {
            "$push": {
                "medicalHistory": {
                    "_id": new ObjectId(),
                    "problem": req.body.problem,
                    "date": req.body.date

                }
            }
        });
        res.json({
            "result": result
        })
    }
    )
    //add new user use "POST", insertOne
    //(CREATE: catCollection)
    app.post("/catCollection", async function (req, res) {

        let { catName, catAge } = req.body;
        if (!validCatName(catName)) {
            res.status(400);
            res.json({
                "error": "Name length must be more than 4 characters"
            });
            return;
        }
        if (!validCatAge(catAge)) {
            res.status(400);
            res.json({
                "error": "Cat age invalid"
            });
            return;
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
                    "comment": req.body.comment,
                    "medicalHistory": req.body.medicalHistory,
                    "pictureUrl": req.body.pictureUrl,

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
            }); //added validation to the create
        }
    })

    //add new user use "POST", insertOne
    //(CREATE: rehomePost)
    app.post("/rehomePost", async function (req, res) {

        if (!req.body.reason) {
            //we have to tell the client that the name cant be null
            res.status(400);
            res.json({
                "error": "You must provide reason"
            });
            return;//end the function
        }
        try {
            const result = await db.collection(REHOMEPOST)
                .insertOne({
                    "catId": req.body.catId,
                    "reason": req.body.reason,
                    "dateofPost": new Date()

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

    //(CREATE: userCollection), insertOne
    app.post("/userCollection", async function (req, res) {
        console.log("🚀 ~ file: index.js:198 ~ req:", req.body)

        let { name, email } = req.body;
        if (!validNameSimple(name)) {
            console.log("The name is empty");
        }
        else { }

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
                    "email": req.body.email

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

    //(UPDATE)modify a document, updateOne
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

    //(UPDATE)existing medical comment, updateOne
    //"$set", .$.
    app.put("/catCollection/:cat_id/medicalHistory/:medicalHistory_id", async function (req, res) {
        //adding medicalHistory comment to the cat id equal to req.params.cat
        const results = await db.collection(CATCOLLECTION).updateOne({
            "_id": new ObjectId(req.params.cat_id),
            "medicalHistory._id": new ObjectId(req.params.medicalHistory_id)
        }, {
            "$set": {
                "medicalHistory.$.problem": req.body.problem,
                "medicalHistory.$.date": req.body.date,
                "medicalHistory.$.symptoms": req.body.symptoms
            }
        });
        res.json({
            "results": results
        })
    }
    )

    //(DELETE), deleteOne catCollection
    app.delete("/catCollection/:cat_id", async function (req, res) {
        const result = await db.collection(CATCOLLECTION).deleteOne({
            "_id": new ObjectId(req.params.cat_id)
        })
        res.json({
            "status": "ok",
            "result": result
        })
    })

    //(DELETE), deleteOne rehomePost
    app.delete("/rehomePost/:rehomepost_id", async function (req, res) {
        const result = await db.collection(REHOMEPOST).deleteOne({
            "_id": new ObjectId(req.params.rehomepost_id)
        })
        res.json({
            "status": "ok",
            "result": result
        })
    })

    //(DELETE), deleteOne rehomePost
    app.delete("/userCollection/:userCollection_id", async function (req, res) {
        const result = await db.collection(USERCOLLECTION).deleteOne({
            "_id": new ObjectId(req.params.userCollection_id)
        })
        res.json({
            "status": "ok",
            "result": result
        })
    })



        ;
}

main();


//write listen first. so that we can ensure theroute goes before
app.listen(3000, function () {
    console.log(`server has started on port http://localhost:${3000}`)
})

//then $ npm install -g nodemon
//then nodemon
