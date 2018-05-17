// router/collections/beers.js
const router = require('express').Router();
const beerHelper = require('../../lib/utils/beerHelper');
const styleHelper = require('../../lib/utils/styleHelper');
const breweryHelper = require('../../lib/utils/breweryHelper');
const validation = require('../../lib/validation');
const beerSchema = require('../../models/beer');
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

router.post('/', function (req, res, next) {
    if (validation.validateAgainstSchema(req.body, beerSchema) && validation) {
        beerHelper.insertIntoCollection(req)
            .then((response)=>{
                res.status(200).json({
                    created: response.ops,
                    links: [{
                        self: `/beers/${response.insertedId}`,
                        collection: `/beers`
                    }]
                });
            })
            .catch((err)=>{
                res.status(500).json({error: err});
            });
    } else {
        res.status(400).json({error: "Incorrect fields in request body."});
    }
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
exports.router = router;
