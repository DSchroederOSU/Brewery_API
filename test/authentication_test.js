//Require the dev-dependencies
let auth = require('../lib/authentication');

let chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should();

chai.use(chaiHttp);

/* Test */
it('should return true if valid user id', function(){
    let token;
    auth.generateAuthToken("somename")
        .then((token)=>{
            // return a jwt in xxxx.xxxx.xxxx format
            token.split(".").should.have.length(3);
        })
        .catch((err)=>{

        });
});