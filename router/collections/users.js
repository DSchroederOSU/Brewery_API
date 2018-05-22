/**
 * @desc this file contains all the routes needed for user authentication
 * specifically registering, logging in
 * User passwords are encrypted with bcrypt library
 * @author Daniel Schroeder <schrodan@oregonstate.edu>
 */
const randomstring = require("randomstring");
const router = require('express').Router();
let dbHelper = require('../../lib/db');
const validation = require('../../lib/validation');
const auth = require('../../lib/authentication');
const jwt = require('jsonwebtoken');
/*
 * Schema describing required fields of a user object.
 */
const userSchema = {
    username: { required: true },
    password: { required: true }
};

/*
    POST /users/login
    request body should include a username and password
    if the user exists, check password against hash in db
    send a JWT token
 */
router.post('/login', function (req, res) {
    let mongodb = dbHelper.getMongo();
    mongodb.collection('users').findOne({username: req.body.username})
        .then((user) => {
            // will return null user if username does not exist
            if(user){
                return auth.checkPassword( req.body.password, user);
            } else {
                return Promise.reject({status: 400, message: "User does not exist."});
            }
        })
        .then((obj) => {
            // obj contains api_key value and username from auth Promise
            // obj = {username: user.username, api: user.api_key}

            let token = jwt.sign({ sub: obj.username, api: obj.api }, process.env.JWT_TOKEN_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
            /* add API key to redis table with rate-limiter value of 0
            redis.generateRedisKey(user.api_key, req.app.locals.redis)
                .then((result)=>{
                    res.status(200).send({ auth: true, token: token });
                })
                .catch((err)=>{
                    res.status(500).json({err: err});
                });
                */
        })
        .catch((err)=>{
            if(err.status){
                res.status(err.status).json({err: err.message});
            } else {
                res.status(500).json({err: err});
            }

        });

});


/*
    POST /users/signup
    request body should include a username and password
    make sure user has not already joined
    create password hash for database, generate API_KEY for rate limiting
    store fields in DB
 */
router.post('/signup', function (req, res) {

    if(validation.validateAgainstSchema(req.body, userSchema)){
        // get mongoDB from helper
        let mongodb = dbHelper.getMongo();
        // query to see if the username already exists
        mongodb.collection('users').findOne({username: req.body.username})
            .then((user)=> {
                if(user){
                    return Promise.reject({status: 400, message: "That username already exists."});
                }
                // if the username was not found, create a new user
                else {
                    return mongodb.collection('users').insertOne({
                        username : req.body.username,
                        password : auth.hashPassword(req.body.password),
                        api_key : randomstring.generate(32)
                    })
                }
            })
            .then(() => {
                /*
                    User was successfully created with a hashed password
                 */
                res.status(201).send({ message: "User successfully added."});
            })
            .catch((err)=>{
                if(err.status){
                    res.status(err.status).json({err: err.message});
                } else {
                    res.status(500).json({err: err});
                }

            })
    } else {
        res.status(400).json({err: "Username and password fields required in request body."});
    }
});


function validateRequestBody(body){
    return validation.validateAgainstSchema(body, userSchema);
}

exports.router = router;