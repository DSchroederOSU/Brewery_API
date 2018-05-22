let ObjectId = require('mongodb').ObjectID;
var exports = module.exports = {};
let dbHelper = require('../db');


exports.getCollectionDocuments = function(req) {
    let query = {};
    if(req.query.search){
        query = {name : {$regex : `.*${req.query.search}.*`, $options: '-i'}};
    }
    return new Promise(function(resolve, reject) {
        dbHelper.getMongo().collection('breweries').find(query).toArray( function(err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        })
    });
};

exports.insertIntoCollection = function(req) {
    let object = req.body;
    return new Promise(function(resolve, reject) {
        dbHelper.getMongo().collection('breweries').insertOne(object)
            .then((result) => {
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

function buildQueryByID(id){
    if(ObjectId.isValid(id)){
        return {_id : ObjectId(id)};
    } else{
        return {name : id};
    }
}
exports.getDocumentByID = function(req, ID) {
    let query = buildQueryByID(ID);
    return new Promise(function(resolve, reject) {
        dbHelper.getMongo().collection('breweries').findOne(query)
            .then((result) => {
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

exports.deleteDocumentByID = function(req, ID) {
    return new Promise(function(resolve, reject) {
        dbHelper.getMongo().collection('breweries').deleteOne({_id : ObjectId(ID)})
            .then((result) => {
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

exports.getBreweryStyles = function(req, ID) {
    /*
        Get all beers belonging to that brewery,
        project only the styles of those beers
     */
    let query = buildQueryByID(ID);
    return new Promise(function(resolve, reject) {
        let brewery = null;
        dbHelper.getMongo().collection('breweries').findOne(query)
            .then((result) => {
                if(result){
                    brewery = result.name;
                    dbHelper.getMongo().collection('beers').find({Brewery :result.name })
                        .project({Style: 1, _id : 0}).toArray(function(err, styles) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({Brewery : brewery, styles : styles});}
                    })
                } else {
                    //route handler will see that this is null and call next();
                    resolve(result);
                }
            })
            .catch((err)=>{
                console.log(err);
                reject(err);
            });
    });
};