// router/routes/collection.js
var express = require('express');

// router for ==> /breweries
var router = express.Router();

// GET /breweries
router.get('/', function (req, res) {
    res.status(200).send("Received GET request at http://localhost:3000/breweries");
});

module.exports = router;
