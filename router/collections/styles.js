// router/collections/styles.js
const router = require('express').Router();
const beerHelper = require('../../lib/utils/beerHelper');
const styleHelper = require('../../lib/utils/styleHelper');
const breweryHelper = require('../../lib/utils/breweryHelper');
const validation = require('../../lib/validation');

// GET /styles
router.get('/', function (req, res) {
    styleHelper.getCollectionDocuments(req)
        .then((styleList)=>{
            res.status(200).json({styles: styleList});
        })
        .catch((err)=>{
            res.status(500).json({error: err});
        });
});

router.post('/', function (req, res) {
    styleHelper.insertIntoCollection(req)
        .then((style)=>{
            res.status(200).json({
                created: style,
                links: [{
                    self: `/style/${style._id}`,
                    collection: `/style`
                }]
            });
        })
        .catch((err)=>{
            res.status(500).json({error: err});
        });
});

router.get('/:styleID', function (req, res, next) {
    let ID = req.params.styleID;
    styleHelper.getDocumentByID(ID)
        .then((style)=>{
            if(style){
                res.status(200).json({
                    style: style,
                    links: [{
                        self: `/styles/${ID}`,
                        collection: `/styles`
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

router.put('/:styleID', function (req, res, next) {
    let ID = req.params.styleID;
    styleHelper.editDocumentById(req.body, ID)
        .then((style)=>{
            if(style){
                res.status(200).json({
                    style: {_id: ID, name: req.body.name},
                    links: [{
                        self: `/styles/${ID}`,
                        collection: `/styles`
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


router.delete('/:styleID', function (req, res, next) {
    let ID = req.params.styleID;
    console.log("fs");
    styleHelper.deleteDocumentByID(req, ID)
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
exports.router = router;