// router/routes/collection.js
var express = require('express');

// router for ==> /beers
var router = express.Router();

// GET /beers
router.get('/', function (req, res) {
    res.status(200).send("Received GET request at http://localhost:3000/beers");
});

module.exports = router;
