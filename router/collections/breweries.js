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
router.get('/', validateJWT, function (req, res) {

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
router.post('/', function (req, res) {
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
            console.log(err);
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

/*
middleware function that sets the schema for validation
allows for dynamic validateAgainstSchema function in validation.js
 */
exports.router = router;
