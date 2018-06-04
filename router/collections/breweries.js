// router/collections/breweries.js
const router = require('express').Router();
const beerHelper = require('../../lib/utils/beerHelper');
const styleHelper = require('../../lib/utils/styleHelper');
const breweryHelper = require('../../lib/utils/breweryHelper');
const {validateAgainstSchema} = require('../../lib/validation');
const {validateJWT} = require('../../lib/authentication');

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
Potential for duplication detection
 */
router.post('/', checkForDuplicate, function (req, res) {
    breweryHelper.insertIntoCollection(req)
        .then((response)=>{
            res.status(200).json({
                created: response,
                links: [{
                    self: `/breweries/${response._id}`,
                    collection: `/breweries`
                }]
            });
        })
        .catch((err)=>{
            if(err.status){
                res.status(err.status).json({error: err.err});
            } else{
                res.status(500).json({error: err});
            }
        });
});

router.get('/:breweryID', function (req, res, next) {
    let ID = req.params.breweryID;
    breweryHelper.getDocumentByID(ID)
        .then((brewery)=>{
            if(brewery){
                res.status(200).json({
                    brewery: brewery,
                    links: [{
                        self: `/breweries/${brewery._id}`,
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
        .then(()=>{
            res.status(202).end();
        })
        .catch((err)=>{
            if(err.status === 404){
                next();
            } else{
                res.status(err.status).json({err: err.error});
            }

        })
});

router.put('/:breweryID', function (req, res, next) {
    let ID = req.params.breweryID;
    breweryHelper.editDocumentById(req, ID)
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


router.get('/:breweryID/styles', function (req, res, next) {
    let ID = req.params.breweryID;
    breweryHelper.getBreweryStyles(req, ID)
        .then((obj)=>{
            console.log(obj);
            if(obj){

                res.status(200).json({
                    styles: obj.beers.map(b =>  { return {Style: b.style.name, StyleID: b.style._id, Beer: b.name }}),
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

// list all beers of a specific style from a particular brewery
router.get('/:breweryID/styles/:styleID', function (req, res, next) {
    let breweryID = req.params.breweryID;
    let styleID = req.params.styleID;
    breweryHelper.getStyleBeers(req, breweryID, styleID)
        .then((obj)=>{
            if(obj){
                res.status(200).json({
                    beers: obj,
                    links: [{
                        self: `/breweries/${breweryID}`,
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

router.get('/:breweryID/beers', function (req, res, next) {
    let ID = req.params.breweryID;
    breweryHelper.getBreweryBeers(ID)
        .then((brewery)=>{
            if(brewery){
                res.status(200).json({
                    brewery: brewery.beers,
                    links: [{
                        self: `/breweries/${brewery._id}`,
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

/*
middleware function that sets the schema for validation
allows for dynamic validateAgainstSchema function in validation.js
 */

function checkForDuplicate(req, res, next) {

    // query brewery in req body
    // Array.filter results by beer name in req body
    breweryHelper.checkDuplicateBrewery(req.body.name)
        .then((brewery)=>{
            if(brewery){
                return res.status(409).json({error: "This brewery already exists."})
            } else {
                return next();
            }
        })
        .catch((err)=>{
            return res.status(500).json({error: "Oops, that's on us."})
        });
}

function validateSchema(req, res, next) {
    let error = new Beer(req.body).validateSync();
    if(error){
        res.status(400).json({error: `${error.errors.name.name}: ${error.errors.name.message}`})
    } else {
        return next();
    }
}
exports.router = router;
