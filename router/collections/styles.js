// router/collections/styles.js
const router = require('express').Router();
const queryHelper = require('../../lib/queryHelper');

// GET /beers
router.get('/', function (req, res) {
    queryHelper.getCollectionDocuments(req.app.locals.mongoDB, 'style')
        .then((styleList)=>{
            res.status(200).json({styles: styleList});
        })
        .catch((err)=>{
            res.status(500).json({error: err});
        });
});
exports.router = router;
