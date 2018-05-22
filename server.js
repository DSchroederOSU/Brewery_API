//server.js
require('dotenv').config();
const redis = require('redis');
const redisClient = redis.createClient(); //creates a new clientnpm
var mongoose = require('mongoose');
var Beer = require('./lib/schemas').Beer;
var Style = require('./lib/schemas').Style;

const data_loader = require('./lib/data_load');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


const MongoClient = require('mongodb').MongoClient;

//require('lib/elasticsearch');

// router ======================================================================
require('./router/router')(app);
function redisConnect(){
    return new Promise((resolve, reject) => {

        redisClient.on('connect', function() {
            app.locals.redis = redisClient;
            resolve();
        });
        redisClient.on("error", function (err) {
            reject({message: err});
        });
    });
}

function mongoConnect(){
    return new Promise((resolve, reject) => {
        const MongoClient = require('mongodb').MongoClient;
        const mongoHost = process.env.MONGO_HOST || 'localhost';
        const mongoDatabase =process.env.MONGO_DATABASE || 'breweryAPI';
        const mongoUser =process.env.MONGO_USER ||'breweryUser';
        const mongoPassword =process.env.MONGO_PASSWORD || 'breweryPassword';
        const mongoPort =process.env.MONGO_PORT || 27017;
        const mongoURL = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;


        MongoClient.connect(mongoURL, { useNewUrlParser: true }, function (err, client){
            if(!err){
                app.locals.mongoDB = client.db(mongoDatabase);
                resolve();
            }
            else{
                reject({message: err});
            }
        });

    });
}

/*
connect to all databases in promise format
 */

function connect(){
    return new Promise((resolve, reject )=>{
        redisConnect()
            .then(() =>{
                console.log("== Redis database...connected");
                return mongoConnect();
            })
            .then(()=>{
                console.log("== MongoDB database...connected");
                resolve();
            })
            .catch((err)=>{
                reject(err);
            });
    });

}

// call the connect function to connect to all databases and start express app
connect()
    .then(()=>{

        app.listen(port, function(){
            console.log("Server running on port : 3000");
        });
    })
    .catch((err)=>{
        console.log(err);
    });

