// router/collections/breweries.js
const router = require('express').Router();
const beerHelper = require('../../lib/utils/beerHelper');
const styleHelper = require('../../lib/utils/styleHelper');
const breweryHelper = require('../../lib/utils/breweryHelper');
const validation = require('../../lib/validation');
const brewerySchema = require('../../lib/validation').beerSchema;
/*
 * Schema describing required/optional fields of a business object.
 */

// GET /breweries
router.get('/', function (req, res) {

    breweryHelper.getCollectionDocuments(req)
        .then((breweriesList)=>{
            res.status(200).json({breweries: breweriesList});
        })
        .catch((err)=>{
            res.status(500).json({error: err});
        });
});

// POST /breweries
/*
This still needs error correction if non-required fills are named wrong or there is a field not defined in schema
 */
router.post('/', function (req, res, next) {
    if (validation.validateAgainstSchema(req.body, brewerySchema) && validation) {
        breweryHelper.insertIntoCollection(req)
            .then((response)=>{
                res.status(200).json({
                    created: response.ops,
                    links: [{
                        self: `/breweries/${response.insertedId}`,
                        collection: `/breweries`
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

router.get('/:breweryID', function (req, res, next) {
    let ID = req.params.breweryID;
    breweryHelper.getDocumentByID(req, ID)
        .then((brewery)=>{
            if(brewery){
                res.status(200).json({
                    brewery: brewery,
                    links: [{
                        self: `/breweries/${ID}`,
                        collection: `/breweries`
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

router.delete('/:breweryID', function (req, res, next) {
    let ID = req.params.breweryID;
    breweryHelper.deleteDocumentByID(req, ID)
        .then((brewery)=>{
            console.log(brewery);
            if(brewery){
                res.status(202).end();
            } else{
                next();
            }
        })
        .catch((err)=>{
            res.status(500).json({err: err});
        })
});

router.get('/:breweryID/styles', function (req, res, next) {
    let ID = req.params.breweryID;
    breweryHelper.getBreweryStyles(req, ID)
        .then((obj)=>{
            console.log(obj);
            if(obj){
                res.status(200).json({
                    brewery: obj.Brewery,
                    styles: obj.styles,
                    links: [{
                        self: `/breweries/${ID}`,
                        collection: `/breweries`
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
exports.router = router;
