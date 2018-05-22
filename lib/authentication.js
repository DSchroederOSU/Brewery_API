var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

module.exports.hashPassword = function(plaintext) {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintext, salt);
};

module.exports.checkPassword = function(check, user) {
    return new Promise(function(resolve, reject){
        if(bcrypt.compareSync(check,  user.password)){
            console.log("OK");
            resolve({username: user.username, api: user.api_key});
        } else {
            reject({status: 404, message: "Incorrect username/password."});
        }
    })
};