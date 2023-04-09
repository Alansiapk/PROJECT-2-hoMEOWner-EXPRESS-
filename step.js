//1.cd folder
//2.npm init
//3.npm install express or yarn add express
//4 npm install mongodb or yarn add mondodb
//5.create index.js under data-api

//yarn add dotenv for env.

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