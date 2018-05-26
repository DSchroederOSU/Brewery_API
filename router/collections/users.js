/**
 * @desc this file contains all the routes needed for user authentication
 * specifically registering, logging in
 * User passwords are encrypted with bcrypt library
 * @author Daniel Schroeder <schrodan@oregonstate.edu>
 */

const router = require('express').Router();
let dbHelper = require('../../lib/db');
const validation = require('../../lib/validation');
const auth = require('../../lib/authentication');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
/*
 * Schema describing required fields of a user object.
 */
const userSchema = {
    username: { required: true },
    password: { required: true }
};


/**
 * POST /users/login
 * request body should include a username and password
 * if the user exists, check password against hash in db
 * send a JWT token
 */
router.post('/login', function (req, res) {
    let mongodb = dbHelper.getMongo();
    let session_user;
    let token;
    mongodb.collection('users').findOne({username: req.body.username})
        .then((user) => {
            // will return null user if username does not exist
            if(user){
                session_user = user;
                console.log(session_user);
                // module for bycrypt checkPassword function to compare password against hash in db
                return auth.checkPassword( req.body.password, session_user.password);
            } else {
                return Promise.reject(401);
            }
        })
        // confirm password and user are correct
        .then(() => {
            return addToRedis(req.ip);
        })
        .then(()=>{
            // if the user was authenticated, we will generate the jwt and add call the addToRedis function
            return auth.generateAuthToken(req.body.username);
        })
        .then((token)=>{
            // if the api key was successfully added to the redis db
            // return jwt to the user
            res.status(200).send({ auth: true, token: token });
        })
        .catch((err)=>{
            if(err === 401){
                res.status(401).json({err: " Invalid credentials."});
            } else {
                res.status(500).json({err: err});
            }

        });

});


/**
 * POST /users/signup
 * request body should include a username and password
 * make sure user has not already joined
 * create password hash for database, generate API_KEY
 * store fields in DB
 */
router.post('/ ', function (req, res) {
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
                    let user = {
                        username : req.body.username,
                        password : auth.hashPassword(req.body.password),
                        api_key :  crypto.randomBytes(48).toString('hex')
                    };
                    return mongodb.collection('users').insertOne(user);
                }
            })
            .then(() => {
                // User was successfully created with a hashed password
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

function addToRedis(ip){
    return new Promise(function(resolve, reject){
        dbHelper.getRedis().set(ip, 1, 'EX', 30);
        dbHelper.getRedis().get(ip, function(err, result) {
            if(result) {
                console.log(result);
                resolve(result);
            } else{
                reject(err);
            }
        });
    })
}

exports.router = router;