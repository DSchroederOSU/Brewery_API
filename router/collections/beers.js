// router/collections/beers.js
const router = require('express').Router();
const beerHelper = require('../../lib/utils/beerHelper');
const styleHelper = require('../../lib/utils/styleHelper');
const breweryHelper = require('../../lib/utils/breweryHelper');
const {validateAgainstSchema, validateBrewery} = require('../../lib/validation');
const beerSchema = require('../../models/beerModel').beerSchema;
// GET /beers
router.get('/', function (req, res) {
    beerHelper.getCollectionDocuments(req)
        .then((beerList)=>{
            res.status(200).json({beer: beerList});
        })
        .catch((err)=>{
            res.status(500).json({error: err});
        });
});

router.get('/:beerID', function (req, res, next) {
    let ID = req.params.beerID;
    beerHelper.getDocumentByID(req, ID)
        .then((beer)=>{
            if(beer){
                res.status(200).json({
                    beer: beer,
                    links: [{
                        self: `/beers/${ID}`,
                        collection: `/beers`
                    }]
                });
            } else{
                next();
            }
        })
        .catch((err)=>{
            res.status(500).json({err: err});
        })
});


router.post('/', function (req, res) {
    let beerObject;
    beerHelper.insertIntoCollection(req)
        .then((response)=> {
            console.log(response);
            beerObject = response.ops[0];
            console.log(beerObject);
            return breweryHelper.addBeer(req.brewery, beerObject);
        })
        .then((response)=>{
            res.status(200).json({
                created: beerObject,
                links: [{
                    self: `/beers/${response.insertedId}`,
                    collection: `/beers`
                }]
            });
        })
        .catch((err)=>{
            res.status(500).json({error: err});
        });

});

router.delete('/:beerID', function (req, res, next) {
    let ID = req.params.beerID;
    beerHelper.deleteDocumentByID(req, ID)
        .then((beer)=>{
            console.log(beer);
            if(beer){
                res.status(202).end();
            } else{
                next();
            }
        })
        .catch((err)=>{
            res.status(500).json({err: err});
        })
});

function setSchema(req, res, next){
    req.schema = beerSchema;
    return next();
}
exports.router = router;
