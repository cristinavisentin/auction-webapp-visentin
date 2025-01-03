const { MongoClient } = require('mongodb');
const MONGO_URI = "mongodb://mongohost";
const DB_NAME = "auction";
let cachedDB;

module.exports = {
    connect2db: async () => {
        if(cachedDB) {
            console.log("Retrieving the existing connection");
            return cachedDB;
        }
        try {
            console.log("Creating a new connection...");
            const client = await MongoClient.connect(MONGO_URI);
            const database = client.db(DB_NAME);
            cachedDB = database;
            return database;
        } catch(error) {
            console.log("ERROR: unable to establish a new connection.");
            console.log(error);
            throw error;
        }
    }
};