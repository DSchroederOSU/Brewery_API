// router/routes/collection.js
var express = require('express');

// router for ==> /styles
var router = express.Router();

// GET /styles
router.get('/', function (req, res) {
    res.status(200).send("Received GET request at http://localhost:3000/styles");
});

module.exports = router;
