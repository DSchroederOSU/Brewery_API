module.exports = function (req, res, next) {
    console.log("== Request Received: ");
    console.log("   -- URL: ", req.url);
    console.log("   -- Method: ", req.method);
    console.log("   -- Body: ", req.body);
    next();
};