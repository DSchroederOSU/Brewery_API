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

Promise.all([dbHelper.connectToRedis(), dbHelper.connectToMongo()])
    .then(function() {
        app.listen(port, function(){
            console.log("Server running on port : 3000");
        });
    })
    .catch((err)=>{
        reject(err);
    });