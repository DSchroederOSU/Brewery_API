// router/routes/collection.js
var express = require('express');

// router for ==> /breweries
var router = express.Router();

// GET /breweries
router.get('/', function (req, res) {
    const mongoDB = req.app.locals.mongoDB;
    const breweriesCollection = mongoDB.collection('brewery');
    breweriesCollection.find({}).toArray(function(err, breweries) {
        res.status(200).json({breweries: breweries});
    });

});

module.exports = router;
