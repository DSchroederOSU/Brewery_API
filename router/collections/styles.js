// router/collections/styles.js
const router = require('express').Router();
const beerHelper = require('../../lib/utils/beerHelper');
const styleHelper = require('../../lib/utils/styleHelper');
const breweryHelper = require('../../lib/utils/breweryHelper');
const validation = require('../../lib/validation');
const styleSchema = require('../../models/style');

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

router.get('/:styleID', function (req, res, next) {
    let ID = req.params.styleID;
    styleHelper.getDocumentByID(req, ID)
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

router.delete('/:styleID', function (req, res, next) {
    let ID = req.params.styleID;
    styleHelper.deleteDocumentByID(req, ID)
        .then((style)=>{
            console.log(style);
            if(style){
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