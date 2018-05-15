var exports = module.exports = {};

exports.getCollectionDocuments = function(mongoClient, collection) {
    return new Promise(function(resolve, reject) {
        mongoClient.collection(collection).find({}).toArray(function(err, docs) {
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