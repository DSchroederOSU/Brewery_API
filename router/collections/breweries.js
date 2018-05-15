// router/collections/breweries.js
const router = require('express').Router();
const queryHelper = require('../../lib/queryHelper');
const validation = require('../../lib/validation');
const brewerySchema = require('../../models/brewery');
/*
 * Schema describing required/optional fields of a business object.
 */

// GET /breweries
router.get('/', function (req, res) {
    queryHelper.getCollectionDocuments(req.app.locals.mongoDB, 'brewery')
        .then((breweriesList)=>{
            res.status(200).json({breweries: breweriesList});
        })
        .catch((err)=>{
            res.status(500).json({error: err});
        });
});

// POST /breweries
router.post('/', function (req, res) {
    if (validation.validateAgainstSchema(res, req.body, brewerySchema) && validation) {
        queryHelper.insertIntoCollection(req.app.locals.mongoDB, 'brewery', req.body)
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
    }
});

exports.router = router;
