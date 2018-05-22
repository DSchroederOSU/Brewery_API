var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

module.exports.hashPassword = function(plaintext) {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintext, salt);
};

module.exports.checkPassword = function(check, stored) {
    return bcrypt.compareSync(check,  stored)
};