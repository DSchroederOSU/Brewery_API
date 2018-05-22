// router/collections/users.js
const router = require('express').Router();
let dbHelper = require('../../lib/db');

// POST /users/login
router.post('/login', function (req, res) {

    dbHelper.getMongo().collection('users').insertOne(req.body)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err)=>{
            res.status(500).json(err);
        });

});

exports.router = router;