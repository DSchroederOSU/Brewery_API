var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
    host: 'http://localhost:9200',
    log: 'trace'
});
/*
elasticClient.ping({
    requestTimeout: 30000,
}, function (error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});
*/

elasticClient.search({
    q: 'pants'
}).then(function (body) {
    var hits = body.hits.hits;
    console.log(body);
}, function (error) {
    console.trace(error.message);
});