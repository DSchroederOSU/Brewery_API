/**
 * @desc A simple node server
 * Promise.all calls database connection functions in db.js
 * If all databases connect successfully, host app
 * Author: Daniel Schroeder
 */

// dotenv is a npm package that allows Environment vars to be
// read in from .env file and used with process.env.VAR
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// router ======================================================================
require('./router/router')(app);

/*
connect to all databases in promise format
 */
const {connectToRedis, connectToMongo} = require('./lib/db');
Promise.all([connectToRedis(), connectToMongo()])
    .then(function() {
        app.listen(port, function(){
            console.log("Server running on port : 3000");
        });
    })
    .catch((err)=>{
        reject(err);
    });