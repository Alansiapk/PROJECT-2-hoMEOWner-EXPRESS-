//for express to talk to mongo, liskewise we need a client
//but this client is for nodejs
const MongoClient = require("mongodb").MongoClient;

async function connect(mongo_uri, databaseName){
const client = await MongoClient.connect(mongo_uri, {
    "useUnifiedTopology": true //simplify our access to Monogo
});

 //get a hoMEOWner database
    //store it in the db variable
    const db = client.db(databaseName); //DB
    return db;
}

//export out the connect function
module.exports ={connect};