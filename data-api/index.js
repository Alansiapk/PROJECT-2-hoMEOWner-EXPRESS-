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

//validation function
const validCatBreed = (breed) => {
    if (typeof (breed) !== 'string' || !breed.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
        return false;
    } else {
        return true;
    }
}

const validCatName = (str) => {
    if (str === "") {
        return false;
    } if (str.trim().length < 3) {
        return false;
    } else {
        return true;
    }
}

const validCatAge = (str) => {
    let nAge = Number(str.trim());
    return !isNaN(nAge);
}

const validCatGender = (gender) => {
    if (gender !== "Male" && gender !== "Female") {
        return false;
    } else {
        return true;
    }
}

const validRequireHomeVisit = (x) => {
    if (x != "Yes Required" && x !== "Not Required") {
        return false;
    } else {
        return true;
    }
}

const validNeutered = (x) => {
    if (x != "Neutered" && x !== "NotNeutered") {
        return false;
    } else {
        return true;
    }
}

const validPersonality = (x) => {
    if (!Array.isArray(x)) {
        // send error if not array
        return false;
    } else {
        return x.every(fstatus => {
            return fstatus.includes('i knew too much') || fstatus.includes('party animal') || fstatus.includes('love bug')
                || fstatus.includes('secret admirer') || fstatus.includes('MVP') || fstatus.includes('shy');
        });
    }
}

const validFamilyStatus = (x) => {
    if (!Array.isArray(x)) {
        // send error if not array
        return false;
    } else {
        return x.every(fstatus => {
            return fstatus.includes('Good with kids') || fstatus.includes('Good with other cats') || fstatus.includes('Leave me alone');
        });
    }
}

const validComment = (str) => {

    if (str.trim().length > 150) {
        return false;
    } else {
        return true;
    }
}

const validProblem = (str) => {

    if (str.trim().length > 50) {
        return false;
    } else {
        return true;
    }
}

const validDate = (date) => {
    // if (typeof (date) !== 'string' || !date.match(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)) {
    //     return false;
    // }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){
        return false;
    }else{
        return true;
    }
}

const validatePictureUrl = (x) => {
    if (!x.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)) {
        return false;
    } else {
        return true;
    }
}

const validName = (str) => {
    if (str === "") {
        return false;
    } if (str.trim().length < 3) {
        return false;
    } else {
        return true;
    }
}

const validEmail = (email) => {
    if (email === "") {
        return false;
    } else if (/^\w+([-]?\w+)@\w+([-]?\w+)(\.\w{2,3})+$/.test(email)) {
        return true;
    } else {
        return false;
    }
};

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

            }
        }

        if (req.query.requireHomeVisit) {
            //add the catname criteria to the filter objeect
            filter.requireHomeVisit = {
                "$regex": req.query.requireHomeVisit,
            }
        }

        if (req.query.neutered) {
            //add the catname criteria to the filter objeect
            filter.neutered = req.query.neutered
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
    app.post("/catCollection/medicalHistory/", async function (req, res) {

        let { problem, date, cat_id} = req.body;
       
        
        try {
            //adding medicalHistory comment to the cat id equal to req.params.cat
            const result = await db.collection(CATCOLLECTION).insertOne({
                "_id": new ObjectId(cat_id)
            }, {
                "$push": {
                    "medicalHistory": {
                        "_id": new ObjectId(),
                        "problem": req.body.problem,
                        "date": req.body.date

                    }
                }
            });
            console.log("🚀 ~ file: index.js:279 ~ result ~ result:", result);
            res.json({
                "result": result
            });
        } catch (e) {

            res.status(503);
            res.json({
                "error": "Database not available. Please try later"
            }) //added validation to the create
        }

    })
    //add new user use "POST", insertOne
    //(CREATE: catCollection)
    app.post("/catCollection", async function (req, res) {

        let { catName, catAge, catBreed, catGender, requireHomeVisit, neutered, personality, familyStatus, comment, pictureUrl, date, problem } = req.body;
        console.log("🚀 ~ file: index.js:298 ~ problem:", problem)
        console.log("🚀 ~ file: index.js:298 ~ date:", date)
        if (!validCatName(catName)) {
            res.status(400);
            res.json({
                "error": "Cat name length must be more than 2 characters"
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

        if (!validCatBreed(catBreed)) {
            res.status(400);
            res.json({
                "error": "Cat breed invalid"
            });
            return;
        }

        if (!validCatGender(catGender)) {
            res.status(400);
            res.json({
                "error": "Please select cat gender"
            });
            return;
        }

        if (!validRequireHomeVisit(requireHomeVisit)) {
            res.status(400);
            res.json({
                "error": "Please select if require home visit"
            });
            return;
        }

        if (!validNeutered(neutered)) {
            res.status(400);
            res.json({
                "error": "Please select if is neutered"
            });
            return;
        }

        if (!validPersonality(personality)) {
            res.status(400);
            res.json({
                "error": "Please select personality"
            });
            return;
        }

        if (!validFamilyStatus(familyStatus)) {
            res.status(400);
            res.json({
                "error": "Please select the family status"
            });
            return;
        }

        if (!validComment(comment)) {
            res.status(400);
            res.json({
                "error": "Cat comment length must be less than 150 characters"
            });
            return;
        }

        if (!validatePictureUrl(pictureUrl)) {
            res.status(400);
            res.json({
                "error": "Please insert correct pictureUrl"
            });
            return;
        }

        // if (!validProblem(problem)) {
        //     res.status(400);
        //     res.json({
        //         "error": "problem length must be less than 50 characters"
        //     });
        //     return;
        // }
        if (!validDate(date)) {
            res.status(400);
            res.json({
                "error": "please insert correct date"
            });
            return;
        }


        // if (){}
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
                    "medicalHistory" : [
                        {
                            problem: req.body.problem,
                            date: req.body.date
                        }
                    ],
                    // "medicalHistory": req.body.medicalHistory,
                    // "medicalHistory.$.problem": req.body.problem,
                    // "medicalHistory.$.date": req.body.date,
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

        if (!validName(name)) {
            res.status(400);
            res.json({
                "error": "Name length must be more than 2 characters"
            });
            return;
        }

        if (!validEmail(email)) {
            res.status(400);
            res.json({
                "error": "invalid email, email must contain special character"
            });
            return;
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
