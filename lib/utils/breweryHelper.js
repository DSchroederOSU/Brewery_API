var ObjectId = require('mongodb').ObjectID;
var exports = module.exports = {};

exports.getCollectionDocuments = function(req) {
    let query = {};
    if(req.query.search){
        query = {name : {$regex : `.*${req.query.search}.*`, $options: '-i'}};
    }
    let mongoClient = req.app.locals.mongoDB;
    return new Promise(function(resolve, reject) {
        mongoClient.collection('breweries').find(query).toArray(function(err, docs) {
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
    let mongoClient = req.app.locals.mongoDB;
    return new Promise(function(resolve, reject) {
        mongoClient.collection('breweries').insertOne(object)
            .then((result) => {
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

exports.getDocumentByID = function(req, ID) {
    let mongoClient = req.app.locals.mongoDB;
    return new Promise(function(resolve, reject) {
        mongoClient.collection('breweries').findOne({_id : ObjectId(ID)})
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
    let mongoClient = req.app.locals.mongoDB;
    return new Promise(function(resolve, reject) {
        mongoClient.collection('breweries').deleteOne({_id : ObjectId(ID)})
            .then((result) => {
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

exports.getBreweryStyles = function(req, ID) {
    let mongoClient = req.app.locals.mongoDB;
    /*
        Get all beers belonging to that brewery,
        project only the styles of those beers
     */

    return new Promise(function(resolve, reject) {
        let brewery = null;
        mongoClient.collection('breweries').findOne({_id : ObjectId(ID)})
            .then((result) => {
                brewery = result.name;
                mongoClient.collection('beers').find({Brewery :result.name }).project({Style: 1, _id : 0}).toArray(function(err, styles) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({Brewery : brewery, styles : styles});
                    }
                }) })

            .catch((err)=>{
                console.log(err);
                reject(err);
            });
    });
};