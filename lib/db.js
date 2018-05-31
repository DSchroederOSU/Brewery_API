const redis = require('redis');
const redisClient = redis.createClient(); //creates a new client
const MongoClient = require( 'mongodb' ).MongoClient;
const mongoose = require('mongoose');
let _mongodb, _redisdb;


module.exports.connectToMongo = function() {
    return new Promise((resolve, reject) => {
        const mongoHost = process.env.MONGO_HOST || 'localhost';
        const mongoDatabase = process.env.MONGO_DATABASE || 'breweryAPI';
        const mongoUser = process.env.MONGO_USER ||'breweryUser';
        const mongoPassword = process.env.MONGO_PASSWORD || 'breweryPassword';
        const mongoPort = process.env.MONGO_PORT || 27017;
        const mongoURL = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;


        mongoose.connect(mongoURL, function(err, db) {
            if (err) {
                reject(err)
            } else {
                _mongodb = db;
                console.log("== MongoDB database...connected");
                resolve();
            }
        });
    });
};
module.exports.connectToRedis = function() {
    return new Promise((resolve, reject) => {
        redisClient.on('connect', function() {
            _redisdb = redisClient;
            console.log("== Redis database...connected");
            resolve();
        });
        redisClient.on("error", function (err) {
            reject({message: err});
        });
    });
};

module.exports.getMongo = function() {
    return _mongodb;
};

module.exports.getRedis = function() {
    return _redisdb;
};