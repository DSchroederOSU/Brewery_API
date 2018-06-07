//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Beer = require('../models/schemas').Beer;
let Style = require('../models/schemas').Style;
let Brewery = require('../models/schemas').Brewery;

//Require the dev-dependencies
let server = require('../server');

let chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should();

chai.use(chaiHttp);

describe('Beers', () => {
    beforeEach((done) => { //Before each test we empty the database
        Beer.find({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/GET beers', () => {
        it('it should GET all the beers', (done) => {
            chai.request(server)
                .get('/beers')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.beer.should.be.a('array');

                    //res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});

describe('Styles', () => {
    beforeEach((done) => { //Before each test we empty the database
        Style.find({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */

    let length = 0;
    describe('/GET styles', () => {
        it('it should GET all the styles', (done) => {
            chai.request(server)
                .get('/styles')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.styles.should.be.a('array');

                    length = res.body.styles.length;
                    done();
                });
        });
    });
    describe('/POST styles', () => {
        it('it should not POST a style without name field', (done) => {
            let style = {
                name: "Juicy IPA"
            };
            chai.request(server)
                .post('/styles')
                .send(style)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('created');
                    res.body.created.should.have.property('_id');
                    res.body.created.should.have.property('name');
                    done();
                });
        });
    });
    describe('/GET styles', () => {
        it('it should GET all the styles', (done) => {
            chai.request(server)
                .get('/styles')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.styles.should.be.a('array');
                    res.body.styles.length.should.be.eql(length+1);
                    done();
                });
        });
    });

});