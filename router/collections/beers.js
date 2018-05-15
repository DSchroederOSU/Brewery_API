// router/collections/beers.js
const router = require('express').Router();
const queryHelper = require('../../lib/queryHelper');

// GET /beers
router.get('/', function (req, res) {
    queryHelper.getCollectionDocuments(req.app.locals.mongoDB, 'beer')
        .then((beerList)=>{
            res.status(200).json({beer: beerList});
        })
        .catch((err)=>{
            res.status(500).json({error: err});
        });
});
exports.router = router;
