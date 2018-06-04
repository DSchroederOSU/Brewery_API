// router/collections/beers.js
const router = require('express').Router();
const beerHelper = require('../../lib/utils/beerHelper');
const styleHelper = require('../../lib/utils/styleHelper');
const breweryHelper = require('../../lib/utils/breweryHelper');
const Beer = require('../../models/schemas').Beer;
const {validateAgainstSchema, validateBrewery} = require('../../lib/validation');

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
    beerHelper.getDocumentByID(ID)
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


router.post('/', validateSchema, checkForDuplicate, function (req, res) {
    // validate brewery exists
    let validBrewery;
    let validStyle;
    let beerObject;
    breweryHelper.getDocumentByID(req.body.Brewery)
        .then((brewery)=>{
            if(brewery){
                validBrewery = brewery;
                return styleHelper.getDocumentByID(req.body.Style);
            } else {
                res.status(404).json({error: "Invalid Brewery in request body."})
            }
        })
        .then((style)=>{
            if(style){
                validStyle = style;
                return beerHelper.insertIntoCollection(validBrewery, validStyle, req.body);
            } else {
                res.status(404).json({error: "Invalid Style in request body."})
            }
        })
        .then((response)=> {
            beerObject = response;
            return breweryHelper.addBeer(validBrewery, validStyle, beerObject);
        })
        .then(()=>{
            res.status(200).json({
                created: beerObject,
                links: [{
                    self: `/beers/${beerObject._id}`,
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


function checkForDuplicate(req, res, next) {

    // query brewery in req body
    // Array.filter results by beer name in req body
    breweryHelper.checkDuplicate(req.body.Brewery, req.body.name)
        .then((beer)=>{
            if(beer){
                return res.status(409).json({error: "This beer already exists."})
            } else {
                return next();
            }
        })
        .catch((err)=>{
            console.log(err);
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
