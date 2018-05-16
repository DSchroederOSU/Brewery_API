var exports = module.exports = {};

exports.getCollectionDocuments = function(req) {
    let search = req.query.search || "";
    let mongoClient = req.app.locals.mongoDB;
    let collection = req.baseUrl.replace (/\//g, "");
    return new Promise(function(resolve, reject) {
        mongoClient.collection(collection).find({name : {$regex : `.*${search}.*`, $options: '-i'}}).toArray(function(err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        })
    });
};

exports.insertIntoCollection = function(mongoClient, collection, object) {
    return new Promise(function(resolve, reject) {
        mongoClient.collection(collection).insertOne(object)
            .then((result) => {
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            });
    });
};