// router/collections/styles.js
const router = require('express').Router();
const queryHelper = require('../../lib/queryHelper');
const validation = require('../../lib/validation');
const styleSchema = require('../../models/style');

// GET /styles
router.get('/', function (req, res) {
    let search = null;
    if(req.query.q){
        search = req.query.q;
    }
    queryHelper.getCollectionDocuments(req)
        .then((styleList)=>{
            res.status(200).json({styles: styleList});
        })
        .catch((err)=>{
            res.status(500).json({error: err});
        });
});


exports.router = router;