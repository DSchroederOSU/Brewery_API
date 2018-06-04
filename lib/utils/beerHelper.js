var ObjectId = require('mongodb').ObjectID;
var exports = module.exports = {};
let dbHelper = require('../db');
const Beer = require('../../models/schemas').Beer;
const Brewery = require('../../models/schemas').Brewery;
const Style = require('../../models/schemas').Style;

exports.getCollectionDocuments = function(req) {
    let query = {};
    if(req.query.search){
        query = {name : {$regex : `.*${req.query.search}.*`, $options: '-i'}};
    }
    return new Promise(function(resolve, reject) {
        Beer.find(query)
            .populate({ path: 'style', select: 'name -_id' })
            .populate({ path: 'brewery', select: 'name -_id' })
            .exec()
            .then((beers)=>{
                resolve(beers);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

exports.insertIntoCollection = function(brewery, style, obj) {
    obj.created_on = new Date();
    return new Promise(function(resolve, reject) {
        var new_beer = new Beer(obj);
        new_beer.style = style;
        new_beer.brewery = brewery;
        new_beer.save(function (err, beer) {
            if (err) {
                return reject(err.message);
            } else {
                resolve(beer);
            }
        });
    });
};

// A nifty function to generate a mongoDB search query
// based on if the user inputs a ObjectID or a name
function buildQueryByID(id){
    return ObjectId.isValid(id) ? {_id : ObjectId(id)} : {name : id};
}

exports.getDocumentByID = function(ID) {
    let query = buildQueryByID(ID);

    return new Promise(function(resolve, reject) {
        Beer.findOne(query)
            .exec()
            .then((results)=>{
                resolve(results);
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

exports.deleteDocumentByID = function(req, ID) {
    // validate valid objectID first
    let query = buildQueryByID(ID);
    return new Promise(function(resolve, reject) {
        Beer.deleteOne(query).exec()
            .then((result)=>{
                if(result.n > 0){
                    resolve();
                } else {
                    reject({status: 404, error: "Brewery not found."})
                }
            })
            .catch((err)=>{
                reject({status: 500, error: err})
            })
    });
};