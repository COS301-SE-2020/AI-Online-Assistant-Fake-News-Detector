// const assert = require("assert");
const chaihttp = require("chai-http");
const chai = require("chai");
const server = require("../db_server");
const { expect } = require("chai");
const { response } = require("../../api_server/api_server");
//Assertion Style
chai.should();

chai.use(chaihttp);

describe("Sources Api", () => {
  it("It should get all known fake news sources", (done) => {
    chai
      .request(server)
      .get("/sources")
      .end((err, response) => {
        expect(err).to.be.null;
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.sources[0].should.have.property("_id");
        response.body.sources[0].should.have.property("name");
        response.body.sources[0].should.have.property("tld");
        done();
      });
  });

  it("It should not get any known fake news sources", (done) => {
      chai
        .request(server)
        .get("/sourcey")
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
    
    it("It should get a source by id", (done) => {
      chai
      .request(server)
      .get("/Sources")
      .end((err, res) => {
        chai
        .request(server)
        .get("/sources/id/" + res.body["sources"][0]._id)
        .end((err, response) => {
          expect(err).to.be.null;
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body["source"].should.have.property("_id");
            response.body["source"].should.have.property("name");
            response.body["source"].should.have.property("tld");
            response.body["source"].name.should.equal(
              res.body["sources"][0]["name"]
              );
              response.body["source"].tld.should.equal(
                res.body["sources"][0]["tld"]
                );
                done();
              });
            });
          });
          
  it("It should get NO source", (done) => {
    const sourceId = "5edf31165d617a2850632424";
    chai
    .request(server)
    .get("/sources/id/" + sourceId)
    .end((err, response) => {
      response.should.have.status(404);
      response.body.should.be.a("object");
      response.body.should.have
      .property("message")
      .eq("No database entry for provided ID");
      done();
      });
    });
    
    it("It should POST a test source", (done) => {
      const source = {
        name: "mocha_test_news_source",
        tld: "www.mochatest.com",
        rating: "500",
      };
      chai
      .request(server)
      .post("/sources")
      .send(source)
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a("object");
        response.body.createdSource.should.be.a("object");
        response.body.createdSource.rating.should.equal(500);
        response.body.createdSource.should.have.property("name");
        response.body.createdSource.should.have.property("tld");
        response.body.createdSource.should.have.property("_id");
        response.body.createdSource.should.have.property("rating");
        done();
      });
    });
    
    it("Post request should fail, because no name is given", (done) => {
      const source = {
        tld: "www.mochatest.com",
        rating: "500",
      };
      chai
      .request(server)
      .post("/sources")
      .send(source)
      .end((err, response) => {
        response.should.have.status(500);
        response.body.should.be.a("object");
        done();
      });
  });
    
  it("It should update a source rating", (done) => {
    const source = {
      rating: "550",
    };
    chai
      .request(server)
      .get("/sources")
      .end((err, res) => {
        chai
          .request(server)
          .put("/sources/" + res.body["sources"][res.body["sources"].length-1]._id)
          .send(source)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a("object");
            response.body.should.have.property("message");
            response.body.message.should.equal("Source Updated");
            done();
          });
      });
  });
  it('It should GET a source based on name', (done) => {
    chai
    .request(server)
    .get("/sources")
    .end((err,res)=>{
      chai
      .request(server)
      .get("/sources/name/"+res.body["sources"][0].name)
      .end((err, response) => {
        expect(err).to.be.null;
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body["source"].should.have.property("_id");
        response.body["source"].should.have.property("name");
        response.body["source"].should.have.property("tld");
        response.body["source"].name.should.equal(
          res.body["sources"][0]["name"]
        );
        response.body["source"].tld.should.equal(
          res.body["sources"][0]["tld"]
        );
        done();
        });
      });
  });
  it("It should delete a single source", (done) => {
    chai
    .request(server)
    .get("/sources")
    .end((err, res) => {
      chai
      .request(server)
      .delete("/sources/" +res.body["sources"][res.body["sources"].length - 1]._id)
      .end(function (error, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.be.a("string");
        res.body.message.should.be.eql("Source Deleted");
        done();
      });
    });
  });          
});
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
describe('Facts Api', () => {
  it('It should get all known fake facts', (done) => {
    chai
      .request(server)
      .get("/facts")
      .end((err, response) => {
        expect(err).to.be.null;
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.facts[0].should.have.property("_id");
        response.body.facts[0].should.have.property("statement");
        response.body.facts[0].should.have.property("popularity");
        done();
      });
    });
    
    it('It should get no fake facts due to path error', (done) => {
      chai
      .request(server)
      .get("/fact")
      .end((err,response)=>{
        response.should.have.status(404);
        done();
      });
    });
    
    it('It should retrieve a single fake fact from the database based on ID', (done) => {
      chai
      .request(server)
      .get("/facts")
      .end((err,res) => {
        chai
        .request(server)
        .get("/facts/"+ res.body["facts"][0]._id)
        .end((err, response)=>{
          expect(err).to.be.null;
          response.should.have.status(200);
          response.should.be.a("object");
          response.body.doc.should.have.property("_id");
          response.body.doc.should.have.property("statement");
          response.body.doc.should.have.property("popularity");
          response.body.doc.popularity.should.equal(
            res.body["facts"][0]["popularity"]
            );
            response.body.doc.statement.should.equal(
              res.body["facts"][0]["statement"]
              );
              done();
            });
          });
        });
        
        it("It should create a new fact in the database", (done)=> {
          chai
          .request(server)
          .post("/Facts")
          .send({ statement: "db server mocha test fact", popularity: "50" })
          .end(function (err, res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            res.body.createdFact.should.be.a("object");
            res.body.createdFact.should.have.property("_id");
            res.body.createdFact.should.have.property("statement");
            res.body.createdFact.should.have.property("popularity");
            done();
          });
        });
        
  it("It should delete a single fact from the database /DELETE facts/:factId", (done)=> {
    chai
      .request(server)
      .get("/Facts")
      .end(function (err, res) {
        chai
        .request(server)
        .delete("/Facts/" + res.body["facts"][res.body["facts"].length - 1]._id)
        .end(function (error, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          done();
        });
      });
    });
});
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
describe('Moderators Api', () => {
  it('It should get all moderators from the database', (done) => {
    chai
      .request(server)
      .get("/Moderators")
      .end((err, response) => {
        expect(err).to.be.null;
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.moderators[0].should.have.property("_id");
        response.body.moderators[0].should.have.property("Name");
        response.body.moderators[0].should.have.property("Email Address");
        done();
      });
  });
  it('It should get a specific moderator based on email', (done) => {
    chai
      .request(server)
      .get("/Moderators")
      .end((err, res) => {
        chai
          .request(server)
          .get("/Moderators/"+res.body.moderators[0]["Email Address"])
          .end((err,response) => {
            response.should.have.status(200);
            response.body.Name.should.equal(res.body.moderators[0]["Name"]);
            done();
          });
      });
    });
});
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
describe('Reports Api', () => {
  it('It should get all reports from the database', (done) => {
    chai
      .request(server)
      .get("/Reports")
      .end((err, response) => {
        expect(err).to.be.null;
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.reports[0].should.have.property("_id");
        response.body.reports[0].should.have.property("type");
        response.body.reports[0].should.have.property("Date Captured");
        done();
      });
  });
  it('It should get a specific report based on id', (done) => {
    chai
      .request(server)
      .get("/Reports")
      .end((err, res) => {
        chai
          .request(server)
          .get("/Reports/id/"+res.body.reports[0]["_id"])
          .end((err,response) => {
            response.should.have.status(200);
            response.body.Report.type.should.equal(res.body.reports[0]["type"]);
            done();
          });
      });
    });
});