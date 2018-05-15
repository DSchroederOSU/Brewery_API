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


const MongoClient = require('mongodb').MongoClient;

const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoDatabase =process.env.MONGO_DATABASE || 'MEAN_TEST';
const mongoUser =process.env.MONGO_USER || 'bookaplace';
const mongoPassword =process.env.MONGO_PASSWORD || 'hunter2';
const mongoPort =process.env.MONGO_PORT || 27017;
const mongoURL = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;


const mysql = require('mysql');
const mysqlHost = process.env.MYSQL_HOST;
const database =process.env.MYSQL_DATABASE;
const mysqluser =process.env.MYSQL_USER;
const mysqlpassword =process.env.MYSQL_PASSWORD;
const mysqlport =process.env.MYSQL_PORT || 3306;
const maxConnections = 10;
app.locals.mysqlPool = mysql.createPool({
    host: mysqlHost,
    database: database,
    port: mysqlport,
    user: mysqluser,
    password: mysqlpassword,
    connectionLimit: maxConnections
});


// router ======================================================================
require('./router/router')(app);


// establish mongo connection
MongoClient.connect(mongoURL, function (err, client){
   if(!err){
       app.locals.mongoDB = client.db(mongoDatabase);
       app.listen(port, function(){
           console.log(client);
           console.log(client.db(mongoDatabase));
           console.log("Server running on port : 3000");
       });
   }
   else{
       console.log(err);
   }
});

