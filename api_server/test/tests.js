const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../api_server");

chai.use(chaiHttp);
describe("Facts", () => {
  it("It should retrieve all facts in database /GET facts", (done) => {
    chai
      .request(server)
      .get("/API/Facts")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.facts[0].should.have.property("_id");
        res.body.facts[0].should.have.property("statement");
        res.body.facts[0].should.have.property("popularity");
        done();
      });
  });

  it("It should retrieve a specific fact from the database /GET facts/:factId", (done) => {
    chai
      .request(server)
      .get("/API/Facts/5ee0e4969332c14e78b1b422")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.doc.should.have.property("_id");
        res.body.doc.should.have.property("statement");
        res.body.doc.should.have.property("popularity");
        res.body.doc.statement.should.equal("Dinosaurs never existed");
        res.body.doc.popularity.should.equal(30);
        done();
      });
  });

  it("It should add a single fact to the database /POST facts", function (done) {
    chai
      .request(server)
      .post("/API/Facts")
      .send({ statement: "Elephants can fly", popularity: "18" })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.createdFact.should.be.a("object");
        res.body.createdFact.should.have.property("statement");
        res.body.createdFact.should.have.property("popularity");
        res.body.createdFact.should.have.property("_id");
        done();
      });
  });

  it("It should delete a single fact from the database /DELETE facts/:factId", function (done) {
    chai
      .request(server)
      .delete("/API/Facts/5ee18a30bd9adf44604ed070")
      .end(function (error, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("deletedCount");
        res.body.deletedCount.should.be.a("number");
        res.body.deletedCount.should.be.eql(1);
        done();
      });
  });
});

describe("Sources", () => {
  it("It should retrieve all sources in the database", (done) => {
    chai
      .request(server)
      .get("/API/Sources")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.sources[0].should.have.property("_id");
        res.body.sources[0].should.have.property("name");
        res.body.sources[0].should.have.property("tld");
        done();
      });
  });

  it("It should retrieve a specific source from the database /GET Sources/:SourceId", (done) => {
    chai
      .request(server)
      .get("/API/Sources/5edfe9d2931e5b74a2297169")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.doc.should.have.property("_id");
        res.body.doc.should.have.property("name");
        res.body.doc.should.have.property("tld");
        res.body.doc.name.should.equal("Wall Street Journal");
        res.body.doc.tld.should.equal("https://www.wsj.com/");
        done();
      });
  });

  it("It should update a single source in the database /PUT sources/:SourceId", function (done) {
    chai
      .request(server)
      .put("/API/Sources/5ee189f0bd9adf44604ed06f")
      .send({ name: "google", tld: "https://google.co.za" })
      .end(function (error, response) {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a("object");
        response.body.should.have.property("nModified");
        response.body.nModified.should.equal(1);
        done();
      });
  });

  it("It should add a single source to the database /POST sources", function (done) {
    chai
      .request(server)
      .post("/API/sources")
      .send({ name: "gmail", rating: 5, tld: "https://gmail.com/" })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.createdSource.should.be.a("object");
        res.body.createdSource.should.have.property("name");
        res.body.createdSource.should.have.property("tld");
        res.body.createdSource.should.have.property("_id");
        res.body.createdSource.should.have.property("rating");
        res.body.createdSource.rating.should.equal(5);
        done();
      });
  });

  it("It should delete a single source from the database /DELETE source/:source", function (done) {
    chai
      .request(server)
      .delete("/API/Sources/5ee189f0bd9adf44604ed06f")
      .end(function (error, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("deletedCount");
        res.body.deletedCount.should.be.a("number");
        res.body.deletedCount.should.be.eql(1);
        done();
      });
  });
});
