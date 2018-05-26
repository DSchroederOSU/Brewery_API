const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbHelper = require('./db');

module.exports.generateAuthToken = function(username) {
    return new Promise(function(resolve, reject) {
        jwt.sign({sub: username}, process.env.JWT_TOKEN_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        }, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};

module.exports.hashPassword = function(plaintext) {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintext, salt);
};

module.exports.checkPassword = function(check, stored) {
    return bcrypt.compare(check, stored);
    /*
    return new Promise(function(resolve, reject){
        if(bcrypt.compareSync(check, stored)){
            resolve();
        } else {
            reject(401);
        }
    })
    */
};

/**
 * This function will act as a route middleware function with a series of authentication steps
 * 1. Query the Redis database to see if the req.ip entry exists
 * 2. If not, create new redis entry
 * 3. If it exists, check that it has not reached maximum limit, increment
 * @param req
 * @param res
 * @param next
 */
module.exports.checkRateLimit = function(req, res, next){

    let redis = dbHelper.getRedis();
    // get value from redis
    redis.get(req.ip, function(err, result) {
        if(err) return res.status(500).json(err);

        // result will be null if the entry has expired
        if(!result){
            redis.set(req.ip, 1, 'EX', 30);
            return next();
        } else {
            console.log(result);
            // otherwise check if value exceeds rate limit
            if(result >= process.env.RATE_LIMIT){
                return res.status(400).json({err: "You have reached the maximum amount of requests."});
            } else {
                redis.incr(req.ip);
                return next();
            }
        }
    })
};

/**
 * Should be a middleware function that happens BEFORE checkRateLimit
 * 1. Check that the user provided a jwt
 * 2. Check that the jwt has an api_key value in the payload
 * @param req
 * @param res
 * @param next
 */
module.exports.validateJWT = function(req, res, next){
//check for correct header
    const authHeader = req.get('Authorization') || null;

    if(!authHeader){
        return res.status(404).json({"err" : "You must be logged in to access this endpoint."});
    }
    // check that header is in bearer token format
    else if(req.headers.authorization.split(' ')[0] !== 'Bearer'){
        return res.status(404).json({"err" : "Tokens must be sent in [Authorization: Bearer token] format."});
    }
    // check that a token is provided
    else if(!req.headers.authorization.split(' ')[1]){
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    else {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_TOKEN_SECRET, function(err, payload){
            if(!err){
                req.user = payload.sub;
                return next();
            } else {
                return res.status(401).send({ auth: false, message: 'Invalid Authentication token.' });
            }
        });
    }
};