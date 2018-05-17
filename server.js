//server.js
var mongoose = require('mongoose');
var Beer = require('./lib/schemas').Beer;
var Style = require('./lib/schemas').Style;
require('dotenv').config();
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

/*
const mongoHost = process.env.MONGO_HOST;
const mongoDatabase =process.env.MONGO_DATABASE;
const mongoUser =process.env.MONGO_USER;
const mongoPassword =process.env.MONGO_PASSWORD;
const mongoPort =process.env.MONGO_PORT || 27017;
const mongoURL = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;
*/

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

//require('lib/elasticsearch');

// router ======================================================================
require('./router/router')(app);
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoDatabase =process.env.MONGO_DATABASE || 'breweryAPI';
const mongoUser =process.env.MONGO_USER ||'breweryUser';
const mongoPassword =process.env.MONGO_PASSWORD || 'breweryPassword';
const mongoPort =process.env.MONGO_PORT || 27017;
const mongoURL = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;

mongoose.connect(`mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`);
// establish mongo connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    let book1 = new Style({name : 'Wheat Ale'});
    book1.save(function (err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to bookstore collection.");
    });

    Style.find({_id : '5afce2ca359c7cd65165fdc0'})

    Style.findById('5afce2ca359c7cd65165fdc0', function (err, s) {
        if (err) return handleError(err);

        s.set({ name: 'kadjh' });
        s.save(function (err, updatedTank) {
            console.log("asd");
        });
    });
    //console.log(beerSchema.fields);

});

MongoClient.connect(mongoURL, function (err, client){
   if(!err){
       app.locals.mongoDB = client.db(mongoDatabase);
       data_loader.testDB(client.db(mongoDatabase))
           .then((results)=>{
               if(results.length === 0){
                   return data_loader.insertData(client.db(mongoDatabase))
               }
           })
           .then((s)=>{

           });

       app.listen(port, function(){
           console.log("Server running on port : 3000");
       });
   }
   else{
       console.log(err);
   }
});
