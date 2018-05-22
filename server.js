//server.js
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const dbHelper = require('./lib/db');
// router ======================================================================
require('./router/router')(app);


/*
connect to all databases in promise format
 */

function connect(){
    return new Promise((resolve, reject )=>{
        dbHelper.connectToRedis()
            .then(() =>{
                console.log("== Redis database...connected");
                return dbHelper.connectToMongo();
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

