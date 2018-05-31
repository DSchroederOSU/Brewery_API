let ObjectId = require('mongodb').ObjectID;
var exports = module.exports = {};
let dbHelper = require('../db');
const Brewery = require('../schemas').Brewery;

exports.getCollectionDocuments = function(req) {
    let query = {};
    if(req.query.search){
        query = {name : {$regex : `.*${req.query.search}.*`, $options: '-i'}};
    }
    return new Promise(function(resolve, reject) {
        Brewery.find(query)
            .exec()
            .then((breweries)=>{
                console.log(breweries);
                resolve(breweries);
            })
            .catch((err)=>{
                console.log(err);
                reject(err);
            });

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
        Brewery.findOne(query)
            .exec()
            .then((results)=>{
                console.log(results);
                resolve(results);
            });
    });
};

exports.editDocumentById = function(req, ID) {
    let query = buildQueryByID(ID);
    return new Promise(function(resolve, reject) {
        dbHelper.getMongo().collection('breweries').updateOne(query)
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
exports.addBeer = function(brewery, beer) {
    return new Promise(function(resolve, reject) {
        dbHelper.getMongo().collection('breweries')
            .update(
                {_id: brewery._id},
                { $push: { beers: beer } }
            )
            .then(() => {
                resolve();
            })
            .catch((err)=>{
                console.log(err);
                reject(err);
            });
    });
}
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