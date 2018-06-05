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
    console.log(query);
    return new Promise(function(resolve, reject) {
        Style.findOne(query)
            .exec()
            .then((results)=>{
                console.log(results);
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
    return new Promise(function(resolve, reject) {
        var new_style = new Style(object);
        new_style.save(function (err, style) {
            if (err) {
                return reject(err.message);
            } else {
                return resolve(style);
            }
        });
    });
};

exports.editDocumentById = function(style, ID) {
    let query = buildQueryByID(ID);
    return new Promise(function(resolve, reject) {
        Style.updateOne(query,  { $set: style}).exec()
            .then((result) => {
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

exports.deleteDocumentByID = function(req, ID) {
    let query = buildQueryByID(ID);
    return new Promise(function(resolve, reject) {
        Style.deleteOne(query).exec()
            .then((result) => {
                if (result.n > 0) {
                    resolve();
                } else {
                    reject({status: 404, error: "Style not found."})
                }
            })
            .catch((err) => {
                reject({status: 500, error: err})
            })
    });
};