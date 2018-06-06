// server/router/router.js
let logger = require('../lib/logger');
let {rateLimit} = require('../lib/rateLimiting');

module.exports = function (app) {

    app.use(logger);
    app.use(rateLimit);

    app.get('/', function (req, res) {
        res.status(200).send("YOU'VE REACHED THE BASE URL OF YOUR API");
    });

    app.use('/beers', require('./collections/beers').router);
    app.use('/breweries', require('./collections/breweries').router);
    app.use('/styles', require('./collections/styles').router);
    app.use('/users', require('./collections/users').router);

    // Catch all
    app.use('*', function (req, res){
        res.status(404).json({err: "Path" + req.originalUrl + " does not exist"});
    });

};