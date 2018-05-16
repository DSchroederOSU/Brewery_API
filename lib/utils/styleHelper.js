var ObjectId = require('mongodb').ObjectID;
var exports = module.exports = {};

exports.getCollectionDocuments = function(req) {
    let query = {};
    if(req.query.search){
        query = {name : {$regex : `.*${req.query.search}.*`, $options: '-i'}};
    }
    let mongoClient = req.app.locals.mongoDB;
    return new Promise(function(resolve, reject) {
        mongoClient.collection('styles').find(query).toArray(function(err, docs) {
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
        mongoClient.collection('styles').insertOne(object)
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
        mongoClient.collection('styles').findOne({_id : ObjectId(ID)})
            .then((result) => {
                console.log(result);
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};