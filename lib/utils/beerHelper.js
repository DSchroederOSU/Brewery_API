var ObjectId = require('mongodb').ObjectID;
var exports = module.exports = {};
let dbHelper = require('../db');
const Beer = require('../schemas').Beer;
const Brewery = require('../schemas').Brewery;
const Style = require('../schemas').Style;

exports.getCollectionDocuments = function(req) {
    let query = {};
    if(req.query.search){
        query = {name : {$regex : `.*${req.query.search}.*`, $options: '-i'}};
    }
    return new Promise(function(resolve, reject) {
        dbHelper.getMongo().collection('beers').find(query).toArray(function(err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        })
    });
};

exports.insertIntoCollection = function(req) {
    console.log("HERE");
    let object = req.body;
    object.created_on = new Date();
    return new Promise(function(resolve, reject) {
        var new_beer = new Beer(object);
        new_beer.save(function (err, beer) {
            if (err) {
                return reject(err);
            } else {
                resolve(beer);
            }
        });
    });
};

exports.getDocumentByID = function(req, ID) {
    return new Promise(function(resolve, reject) {
        dbHelper.getMongo().collection('beers').findOne({_id : ObjectId(ID)})
            .then((result) => {
                console.log(result);
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

exports.deleteDocumentByID = function(req, ID) {
    return new Promise(function(resolve, reject) {
        dbHelper.getMongo().collection('beers').deleteOne({_id : ObjectId(ID)})
            .then((result) => {
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};