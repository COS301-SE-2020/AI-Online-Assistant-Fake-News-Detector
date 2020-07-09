const assert = require('assert');
const chaihttp = require('chai-http');
const chai = require('chai');
const server = require('../db_server');
//Assertion Style
chai.should();

chai.use(chaihttp);

describe('Sources Api', function(){
    this.timeout(10000); 

    /**
     * Test GET route
     */
    describe('GET /sources', ()=>{
        it('It should get all known fake news sources', (done) => {
            chai.request(server)
                .get("/sources")
                .end((err, response)=>{
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                done();
                });
        });
        it('It should not get any known fake news sources', (done) => {
            chai.request(server)
                .get("/sourcey")
                .end((err, response)=>{
                    response.should.have.status(404);
                done();
                });
        });
    });
    /**
     * Test GET (by id) route
     */
    describe('GET /sources/:_id', ()=>{
        it('It should get a source by id', (done) => {
            const sourceId = "5edf31165d617a2850632422";
            chai.request(server)
                .get("/sources/"+sourceId)
                .end((err, response)=>{
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                done();
                });
        });
        it('It should get NO source', (done) => {
            const sourceId = "5edf31165d617a2850632424";
            chai.request(server)
                .get("/sources/"+sourceId)
                .end((err, response)=>{
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq("No database entry for provided ID");
                    done();
                });
            });
        });
        /**
         * Test PUT (by id) route
         */
        describe('PUT /sources/:_id', ()=>{
            it('It should POST a test source', (done) => {
                const sourceid = "5edf31165d617a2850632422";
                const source = {
                    rating: "500"
                }
                chai.request(server)
                .put("/sources/"+sourceid)
                .send(source)
                .end((err, response)=>{
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    done();
                });
            });
        });
        /**
         * Test POST route
         */
        describe('POST /sources/', ()=>{
            it('It should POST a test source', (done) => {
                const source = {
                    name: "mocha_test_news_source",
                    tld: "www.mochatest.com",
                    rating: "500"
                }
                chai.request(server)
                .post("/sources")
                .send(source)
                .end((err, response)=>{
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    done();
                });
            });
            it('Post request should fail, because no name is given', (done) => {
                const source = {
                    tld: "www.mochatest.com",
                rating: "500"
            }
            chai.request(server)
            .post("/sources")
            .send(source)
            .end((err, response)=>{
                response.should.have.status(500);
                response.body.should.be.a('object');
            done();
            });
        });
    });
    /**
     * Test DELETE route
     */
});