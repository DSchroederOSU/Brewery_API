var exports = module.exports = {};

exports.testDB = function(mongo) {
    return new Promise(function(resolve, reject) {
        mongo.collection('beers').find().toArray( function  (err, data){
            resolve(data);
        });
    });
    };

exports.insertData = function(mongo) {
    mongo.collection('breweries').findOne({name : "Sky High Brewing"})
        .then((sky)=>{
            console.log(sky);
            mongo.collection('beers').insertOne({
                name: "Freewheel IPA",
                description: "For you Freewheeling PNW Hop Heads out there, " +
                "we break out our HopBack for our unique take on " +
                "IPA. A cornucopia of hop varieties added in the " +
                "boil, at the HopBack and in the fermenter lend " +
                "fruity and floral notes to a melodious hoppy brew.",
                in_stores : false,
                ibu : 77,
                abv : 7,
                created_on : new Date(),
                Brewery : sky._id,
                Style : "IPA"
            })
        })

};
