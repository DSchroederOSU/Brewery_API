let ObjectId = require('mongodb').ObjectID;
var exports = module.exports = {};
let dbHelper = require('../db');
const Brewery = require('../../models/schemas').Brewery;

exports.getCollectionDocuments = function(req) {
    let query = {};
    if(req.query.search){
        query = {name : {$regex : `.*${req.query.search}.*`, $options: '-i'}};
    }
    return new Promise(function(resolve, reject) {
        Brewery.find(query)
            .populate({ path: 'beers', select: 'name -_id' })
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
        var new_brewery = new Brewery(object);
        new_brewery.save(function (err, brewery) {
            if (err) {
                return reject(err.message);
            } else {
                return resolve(brewery);
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
        Brewery.findOne(query)
            .exec()
            .then((results)=>{
                resolve(results);
            });
    });
};

exports.checkDuplicate = function(brewery, beer) {
    let query = {'name' : brewery};

    return new Promise(function(resolve, reject) {
        Brewery.findOne(query)
            .populate('beers')
            .exec()
            .then((results)=>{
                resolve(results.beers.filter(x => x.name === beer)[0]);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

exports.editDocumentById = function(req, ID) {
    let query = buildQueryByID(ID);
    console.log(query);
    return new Promise(function(resolve, reject) {
        Brewery.updateOne(query,  { $set: req.body}).exec()
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
        Brewery.deleteOne(query).exec()
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

        /*dbHelper.getMongo().collection('breweries').deleteOne({_id : ObjectId(ID)})
            .then((result) => {
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });*/
    });
};
exports.addBeer = function(brewery, style, beer) {
    return new Promise(function(resolve, reject) {
        Brewery.update(
            { _id: brewery._id },
            { $push: { beers: beer._id } }
        ).exec()
            .then((results)=>{
                resolve(results);
            })
            .catch((err)=>{
                reject(err);
            })
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