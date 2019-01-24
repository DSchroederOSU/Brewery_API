const redis = require('redis'); //creates a new client
const MongoClient = require( 'mongodb' ).MongoClient;
const mongoose = require('mongoose');
let _mongodb, _redisdb;


module.exports.connectToMongo = function() {
    return new Promise((resolve, reject) => {
        // legacy connection to local docker-compose.yml
        /*
        const mongoHost = process.env.MONGO_HOST;
        const mongoDatabase = process.env.MONGO_DATABASE;
        const mongoUser = process.env.MONGO_USER;
        const mongoPassword = process.env.MONGO_PASSWORD;
        const mongoPort = process.env.MONGO_PORT || 27017;
        const mongoURL = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;
        */

        //switch to heroku
        const mongoURL = process.env.MONGODB_URI;
        mongoose.connect(mongoURL)
            .then((db) => {
                _mongodb = db;
                console.log("== MongoDB database...connected");
                resolve();
            })
            .catch((err)=>{
                reject(err);
            } );
    });
};

module.exports.connectToRedis = function() {
    return new Promise((resolve) => {
        // legacy
        //let redisClient = redis.createClient(6379, process.env.REDIS_HOST);
        // heroku
        let redisClient = redis.createClient(process.env.REDIS_URL);
        redisClient.on('connect', function() {
            _redisdb = redisClient;
            console.log("== Redis database...connected");
            resolve();
        });
    });
};

module.exports.getMongo = function() {
    return _mongodb;
};

module.exports.getRedis = function() {
    return _redisdb;
};
