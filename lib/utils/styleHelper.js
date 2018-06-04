var ObjectId = require('mongodb').ObjectID;
var exports = module.exports = {};
const Style = require('../../models/schemas').Style;
// A nifty function to generate a mongoDB search query
// based on if the user inputs a ObjectID or a name
function buildQueryByID(id){
    return ObjectId.isValid(id) ? {_id : ObjectId(id)} : {name : id};
}

exports.getDocumentByID = function(ID) {
    let query = buildQueryByID(ID);

    return new Promise(function(resolve, reject) {
        Style.findOne(query)
            .exec()
            .then((results)=>{
                resolve(results);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

exports.getCollectionDocuments = function(req) {
    let query = {};
    if(req.query.search){
        query = {name : {$regex : `.*${req.query.search}.*`, $options: '-i'}};
    }
    return new Promise(function(resolve, reject) {
        Style.find(query)
            .exec()
            .then((styles)=>{
                resolve(styles);
            })
            .catch((err)=>{
                reject(err);
            });

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

exports.deleteDocumentByID = function(req, ID) {
    let mongoClient = req.app.locals.mongoDB;
    return new Promise(function(resolve, reject) {
        mongoClient.collection('styles').deleteOne({_id : ObjectId(ID)})
            .then((result) => {
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};