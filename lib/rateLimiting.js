/**
 * This file implements the token-bucket algorithm for rate limiting with redis
 * Rate limiting is based on a <key, value> pair that uses the client's IP address
 * as a key.
 * @exports rateLimit() to be used as a middleware function for express routes.
 *
 */

const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS); // get max requests ENV variable
const timeFrame = parseInt(process.env.RATE_LIMIT_TIME_FRAME); // get time frame ENV variable
const dbHelper = require('./db');


module.exports.rateLimit = function(req, res, next) {
    const now = Date.now();

    let ip = req.ip; // this is useless. but I'm doing it anyway

    // get user entry from Redis database
    // Redis will return null of the entry does not exist (user has not made an API request yet)
    getUserTokenBucket(ip)
        .then((tokenBucket) => {
            if (!tokenBucket) {
                return generateRedisEntry(ip, now, maxRequests);
            } else {
                // check users API use and either accept or deny request
                return checkRateLimit(req, tokenBucket, now)
            }
        })
        .then((result)=>{
            // checkRateLimit will return true if the user request was accepted
            // otherwise we return false to signify the user has reached its rate limit
            if(result){
                next();
            } else {
                res.status(429).json({message: "You have reached the maximum amount of requests for the given timeframe."})
            }
        })
        .catch((err) => {
            next();
        });
};


function getUserTokenBucket(ip) {
    return new Promise((resolve, reject) => {
        let redis = dbHelper.getRedis();
        redis.hgetall(ip, function (err, tokenBucket) {
            if (err) {
                reject(err);
            } else {
                if (tokenBucket) {
                    tokenBucket.tokens = parseFloat(tokenBucket.tokens);
                }
                resolve(tokenBucket);
            }
        });
    });
}

function generateRedisEntry(ip, now, max){
    return new Promise((resolve, reject) => {
        let redis = dbHelper.getRedis();
        redis.hmset([ip, "tokens", max, "last", now], function (err, res) {
            if(err){
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

function getResupplyAmount(currentTokens, resupply, max){
    return (((currentTokens + resupply) > max) ? max : (currentTokens + resupply));
}

function checkRateLimit(req, tokenBucket, now){
    return new Promise((resolve, reject) => {
        let redis = dbHelper.getRedis();

        let resupplyRate = (maxRequests/timeFrame); // calculate the token/second rate of resupply

        let timeDelta = (now - tokenBucket.last)/1000; // calculate the elapsed time. convert to from MS to S

        let resupplyAmount = resupplyRate*timeDelta; // find how many tokens should be allotted for the time elapsed

        let resupplyTokens = getResupplyAmount(tokenBucket.tokens, resupplyAmount, maxRequests);

        if(resupplyTokens < 1.0){
            // not enough tokens for request
            // resupply tokens, reset last timestamp, return
            redis.hmset([req.ip, "tokens", resupplyTokens, "last", now], function (err, res) {
                if(err){
                    reject(err);

                } else {
                    resolve(res);
                }
            });
            resolve(false);
        } else {
            // use a token to make API request, reset last timestamp
            redis.hmset([req.ip, "tokens", resupplyTokens-1, "last", now], function (err, res) {
                if(err){
                    reject(err);
                } else {
                    resolve(res);
                }
            });
            resolve(true);
        }
    });
}
