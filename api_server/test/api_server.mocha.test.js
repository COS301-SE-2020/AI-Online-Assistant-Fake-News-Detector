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
      .get("/API/Facts")
      .end((err, responder) => {
        chai
          .request(server)
          .get("/API/Facts/" + responder.body["facts"][0]._id)
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.doc.should.have.property("_id");
            res.body.doc.should.have.property("statement");
            res.body.doc.should.have.property("popularity");
            res.body.doc.statement.should.equal(
              responder.body["facts"][0]["statement"]
            );
            res.body.doc.popularity.should.equal(
              responder.body["facts"][0]["popularity"]
            );
            done();
          });
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
      .get("/API/Facts")
      .end(function (err, responder) {
        chai
          .request(server)
          .delete(
            "/API/Facts/" +
              responder.body["facts"][responder.body["facts"].length - 1]._id
          )
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

  it("It should retrieve a specific source from the database /GET Sources/id/:SourceId", (done) => {
    chai
      .request(server)
      .get("/API/Sources")
      .end((err, responder) => {
        chai
          .request(server)
          .get("/API/Sources/id/" + responder.body["sources"][0]._id)
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body["source"].should.have.property("_id");
            res.body["source"].should.have.property("name");
            res.body["source"].should.have.property("tld");
            res.body["source"].name.should.equal(
              responder.body["sources"][0]["name"]
            );
            res.body["source"].tld.should.equal(
              responder.body["sources"][0]["tld"]
            );
            done();
          });
      });
  });

  it("It should retrieve a specific source from the database /GET Sources/name/:SourceName", (done) => {
    chai
      .request(server)
      .get("/API/Sources")
      .end((err, responder) => {
        chai
          .request(server)
          .get(
            "/API/Sources/name/" +
              responder.body["sources"][responder.body["count"] - 1].name
          )
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body["source"].should.have.property("_id");
            res.body["source"].should.have.property("name");
            res.body["source"].should.have.property("tld");
            res.body["source"].name.should.equal(
              responder.body["sources"][responder.body["count"] - 1]["name"]
            );
            res.body["source"].tld.should.equal(
              responder.body["sources"][responder.body["count"] - 1]["tld"]
            );
            done();
          });
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

  it("It should update a single source in the database /PUT sources/:SourceId", function (done) {
    chai
      .request(server)
      .get("/API/Sources")
      .end((err, responder) => {
        chai
          .request(server)
          .put(
            "/API/Sources/" +
              responder.body["sources"][responder.body["sources"].length - 1]
                ._id
          )
          .send({ name: "google", tld: "https://google.co.za" })
          .end(function (error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a("object");
            response.body.should.have.property("message");
            response.body.message.should.equal("Source Updated");
            done();
          });
      });
  });

  it("It should delete a single source from the database /DELETE source/:source", function (done) {
    chai
      .request(server)
      .get("/API/Sources")
      .end((err, responder) => {
        chai
          .request(server)
          .delete(
            "/API/Sources/" +
              responder.body["sources"][responder.body["sources"].length - 1]
                ._id
          )
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

describe("Moderators", () => {
  it("It should retrieve all moderators in the database", (done) => {
    chai
      .request(server)
      .get("/API/Moderators")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.moderators[0].should.have.property("_id");
        res.body.moderators[0].should.have.property("Name");
        res.body.moderators[0].should.have.property("Email Address");
        done();
      });
  });

  it("It should retrieve a specific moderator from the database /GET Moderators/:emailAddress", (done) => {
    chai
      .request(server)
      .get("/API/Moderators")
      .end((err, responder) => {
        chai
          .request(server)
          .get(
            "/API/Moderators/" + responder.body.moderators[0]["Email Address"]
          )
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("_id");
            res.body.should.have.property("Name");
            res.body.should.have.property("Email Address");
            res.body.should.have.property("Authentication Level");
            res.body.Name.should.equal(responder.body.moderators[0]["Name"]);
            done();
          });
      });
  });

  it("It should add a Moderator to the database /POST Moderators", function (done) {
    chai
      .request(server)
      .post("/API/Moderators")
      .send({
        emailAddress: "5Bits@gmail.com",
        password: "Stuart123456789",
        fName: "Stuart",
        lName: "Barclay",
        phoneNumber: "0793580784",
      })
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body["Moderator Details"].should.be.a("object");
        res.body["Moderator Details"].should.have.property("fName");
        res.body["Moderator Details"].should.have.property("emailAddress");
        res.body["Moderator Details"].should.have.property("_id");
        res.body["Moderator Details"].should.have.property("lName");
        done();
      });
  });

  it("It should update a moderator in the database /PUT Moderators/:emailAddress", function (done) {
    chai
      .request(server)
      .get("/API/Moderators")
      .end((err, responder) => {
        chai
          .request(server)
          .put(
            "/API/Moderators/" +
              responder.body.moderators[responder.body.count - 1][
                "Email Address"
              ]
          )
          .send({ fName: "test", authenticationLevel: 2 })
          .end(function (error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a("object");
            response.body.should.have.property("message");
            response.body.message.should.equal("Moderator Details Updated");
            done();
          });
      });
  });

  it("It should delete a single source from the database /DELETE Moderators/:emailAddress", function (done) {
    chai
      .request(server)
      .get("/API/Moderators")
      .end((err, responder) => {
        chai
          .request(server)
          .delete(
            "/API/Moderators/" +
              responder.body.moderators[responder.body.count - 1][
                "Email Address"
              ]
          )
          .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            res.body.message.should.be.a("string");
            res.body.message.should.be.eql("Moderator deleted");
            done();
          });
      });
  });
});

describe("Reports", () => {
  it("It should add a Report to the database /POST Reports", function (done) {
    chai
      .request(server)
      .post("/API/Reports")
      .send({
        type: "1",
        description: "Mocha Test",
      })
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body["Report Details"].should.be.a("object");
        res.body["Report Details"].should.have.property("type");
        res.body["Report Details"].should.have.property("Report Data");
        res.body["Report Details"].should.have.property("_id");
        done();
      });
  });

  it("It should retrieve all reports from the database /GET", (done) => {
    chai
      .request(server)
      .get("/API/Reports")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.reports[0].should.have.property("_id");
        res.body.reports[0].should.have.property("type");
        res.body.reports[0].should.have.property("Date Captured");
        done();
      });
  });

  it("It should retrieve a specific report from the database /GET Reports/id/:id", (done) => {
    chai
      .request(server)
      .get("/API/Reports")
      .end((err, responder) => {
        chai
          .request(server)
          .get("/API/Reports/id/" + responder.body.reports[0]["_id"])
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.Report.should.have.property("_id");
            res.body.Report.should.have.property("type");
            res.body.Report.should.have.property("Report Data");
            res.body.Report.should.have.property("Date Captured");
            res.body.Report.type.should.equal(
              responder.body.reports[0]["type"]
            );
            done();
          });
      });
  });

  it("It should retrieve all active reports from the database /GET Reports/active/:active", (done) => {
    chai
      .request(server)
      .get("/API/Reports/active/1")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.reports[0].should.have.property("_id");
        res.body.reports[0].should.have.property("type");
        res.body.reports[0].should.have.property("Report Data");
        res.body.reports[0].should.have.property("Date Captured");
        done();
      });
  });

  it("It should retrieve all reports with the type fact from the database /GET Reports/type/:type", (done) => {
    chai
      .request(server)
      .get("/API/Reports")
      .end((err, responder) => {
        chai
          .request(server)
          .get("/API/Reports/type/1")
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.reports[0].should.have.property("_id");
            res.body.reports[0].should.have.property("type");
            res.body.reports[0].should.have.property("Report Data");
            res.body.reports[0].should.have.property("Date Captured");
            done();
          });
      });
  });

  it("It should update a moderator in the database /PUT Reports/active/:active", function (done) {
    chai
      .request(server)
      .get("/API/Reports")
      .end((err, responder) => {
        chai
          .request(server)
          .put("/API/Reports/active/1")
          .send({ bActive: 0 })
          .end(function (error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a("object");
            response.body.should.have.property("message");
            response.body.message.should.equal("Report Updated");
            done();
          });
      });
  });

  it("It should update a moderator in the database /PUT Reports/type/:type", function (done) {
    chai
      .request(server)
      .get("/API/Reports")
      .end((err, responder) => {
        chai
          .request(server)
          .put("/API/Reports/type/1")
          .send({ bActive: 1 })
          .end(function (error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a("object");
            response.body.should.have.property("message");
            response.body.message.should.equal("Report Updated");
            done();
          });
      });
  });

  it("It should update a moderator in the database /PUT Reports/id/:id", function (done) {
    chai
      .request(server)
      .get("/API/Reports/type/1")
      .end((err, responder) => {
        chai
          .request(server)
          .put(
            "/API/Reports/id/" +
              responder.body.reports[responder.body.count - 1]["_id"]
          )
          .send({ bActive: 0 })
          .end(function (error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a("object");
            response.body.should.have.property("message");
            response.body.message.should.equal("Report Updated");
            done();
          });
      });
  });

  it("It should delete a single source from the database /DELETE Reports/id/:id", function (done) {
    chai
      .request(server)
      .get("/API/Reports")
      .end((err, responder) => {
        chai
          .request(server)
          .delete("/API/Reports/id/" + responder.body.reports[0]["_id"])
          .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            res.body.message.should.be.a("string");
            res.body.message.should.be.eql("Report deleted");
            done();
          });
      });
  });
});
