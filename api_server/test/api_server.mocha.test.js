const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../api_server");

chai.use(chaiHttp);

describe("Facts", () => {
  it("It should add a single fact to the database /POST facts", function (done) {
    chai
      .request(server)
      .post("/API/Facts")
      .send({ statement: "Elephants can fly", popularity: 18 })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.response.should.have.property("message");
        res.body.response.Fact.should.be.a("object");
        res.body.response.Fact.should.have.property("Statement");
        res.body.response.Fact.should.have.property("Popularity");
        res.body.response.Fact.should.have.property("ID");
        done();
      });
  });
  it("It should retrieve all facts in database /GET facts", (done) => {
    chai
      .request(server)
      .get("/API/Facts")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.response.Facts[0].should.have.property("ID");
        res.body.response.Facts[0].should.have.property("Statement");
        res.body.response.Facts[0].should.have.property("Popularity");
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
          .get("/API/Facts/" + responder.body.response.Facts[0].ID)
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.response.Fact.should.have.property("ID");
            res.body.response.Fact.should.have.property("Statement");
            res.body.response.Fact.should.have.property("Popularity");
            res.body.response.Fact.Statement.should.equal(
              responder.body.response.Facts[0].Statement
            );
            res.body.response.Fact.Popularity.should.equal(
              responder.body.response.Facts[0].Popularity
            );
            done();
          });
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
              responder.body.response.Facts[
                responder.body.response.Facts.length - 1
              ].ID
          )
          .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.response.should.have.property("message");
            res.body.response.success.should.be.a("boolean");
            res.body.response.success.should.be.eql(true);
            done();
          });
      });
  });
});

describe("Sources", () => {
  it("It should add a single source to the database /POST sources", function (done) {
    chai
      .request(server)
      .post("/API/sources")
      .send({ name: "gmail", rating: 5, tld: "https://gmail.com/" })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.response.should.have.property("message");
        res.body.response.Source.should.be.a("object");
        res.body.response.Source.should.have.property("Name");
        res.body.response.Source.should.have.property("Domain Name");
        res.body.response.Source.should.have.property("ID");
        res.body.response.Source.should.have.property("Rating");
        res.body.response.Source.Rating.should.equal(5);
        done();
      });
  });
  it("It should retrieve all sources in the database", (done) => {
    chai
      .request(server)
      .get("/API/Sources")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("response");
        res.body.response.should.have.property("message");
        res.body.response.should.have.property("count");
        res.body.response.Sources[0].should.have.property("ID");
        res.body.response.Sources[0].should.have.property("Name");
        res.body.response.Sources[0].should.have.property("Rating");
        res.body.response.Sources[0].should.have.property("Domain Name");
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
          .get("/API/Sources/id/" + responder.body.response.Sources[0].ID)
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.response.Source.should.have.property("ID");
            res.body.response.Source.should.have.property("Name");
            res.body.response.Source.should.have.property("Domain Name");
            res.body.response.Source.Name.should.equal(
              responder.body.response.Sources[0].Name
            );
            res.body.response.Source["Domain Name"].should.equal(
              responder.body.response.Sources[0]["Domain Name"]
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
          .get("/API/Sources/name/" + responder.body.response.Sources[0].Name)
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.response.Source.should.have.property("ID");
            res.body.response.Source.should.have.property("Name");
            res.body.response.Source.should.have.property("Domain Name");
            res.body.response.Source.Name.should.equal(
              decodeURI(responder.body.response.Sources[0]["Name"])
            );
            res.body.response.Source["Domain Name"].should.equal(
              responder.body.response.Sources[0]["Domain Name"]
            );
            done();
          });
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
            "/API/Sources/id/" +
              responder.body.response.Sources[
                responder.body.response.Sources.length - 1
              ].ID
          )
          .send({
            name: "google",
            tld: "https://google.co.za?" + (Math.random() * 100).toFixed(0),
          })
          .end(function (error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a("object");
            response.body.response.should.have.property("message");
            response.body.response.message.should.equal(
              "Source details updated"
            );
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
            "/API/Sources/id/" +
              responder.body.response.Sources[
                responder.body.response.Sources.length - 1
              ].ID
          )
          .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.response.should.have.property("message");
            res.body.response.message.should.be.a("string");
            res.body.response.message.should.be.eql("Source deleted");
            done();
          });
      });
  });
});

describe("Users", () => {
  let email = "testEmail" + (Math.random() * 100).toFixed(0) + "@gmail.com";
  it("It should log a Moderator into the system /POST Users/login", (done) => {
    chai
      .request(server)
      .post("/API/Users/login")
      .send({
        emailAddress: "5bits@gmail.com",
        password: "5Bits@@",
      })
      .end((err, res) => {
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.response.should.have.property("message");
        res.body.response.should.have.property("token");
        done();
      });
  });

  it("It should add a Moderator to the database /POST Users", (done) => {
    chai
      .request(server)
      .post("/API/Users/register")
      .send({
        emailAddress: email,
        password: "password",
        fName: "Stuart" + (Math.random() * 100).toFixed(0),
        lName: "Barclay",
        phoneNumber: "0793580784",
        authenticationLevel: 3,
      })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.response.should.have.property("message");
        res.body.response.User.should.be.a("object");
        res.body.response.User.should.have.property("Name");
        res.body.response.User.should.have.property("Email Address");
        res.body.response.User.should.have.property("ID");
        done();
      });
  });

  it("It should retrieve all Users in the database", (done) => {
    chai
      .request(server)
      .post("/API/Users/login")
      .send({
        emailAddress: email,
        password: "password",
      })
      .end((err, responsder) => {
        let token = responsder.body.response.token;
        chai
          .request(server)
          .get("/API/Users")
          .set("x-access-token", token)
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.response.Users[0].should.have.property("ID");
            res.body.response.Users[0].should.have.property("Name");
            res.body.response.Users[0].should.have.property("Email Address");
            done();
          });
      });
  });

  it("It should retrieve a specific moderator from the database /GET Users/emailAddress/:emailAddress", (done) => {
    chai
      .request(server)
      .post("/API/Users/login")
      .send({
        emailAddress: email,
        password: "password",
      })
      .end((err, responsder) => {
        let token = responsder.body.response.token;
        chai
          .request(server)
          .get("/API/Users")
          .set("x-access-token", token)
          .end((err, responder) => {
            chai
              .request(server)
              .get(
                "/API/Users/emailAddress/" +
                  responder.body.response.Users[0]["Email Address"]
              )
              .set("x-access-token", token)
              .end((err, res) => {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.response.User.should.have.property("ID");
                res.body.response.User.should.have.property("Name");
                res.body.response.User.should.have.property("Email Address");
                res.body.response.User.should.have.property(
                  "Authentication Level"
                );
                res.body.response.User.Name.should.equal(
                  responder.body.response.Users[0].Name
                );
                done();
              });
          });
      });
  });

  it("It should update a moderator in the database /PUT Users/:emailAddress", function (done) {
    chai
      .request(server)
      .post("/API/Users/login")
      .send({
        emailAddress: email,
        password: "password",
      })
      .end((err, responsder) => {
        let token = responsder.body.response.token;
        chai
          .request(server)
          .get("/API/Users")
          .set("x-access-token", token)
          .end((err, responder) => {
            chai
              .request(server)
              .put(
                "/API/Users/" +
                  responder.body.response.Users[
                    responder.body.response.count - 1
                  ]["Email Address"]
              )
              .send({ fName: "test" })
              .set("x-access-token", token)
              .end(function (error, response) {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a("object");
                response.body.response.should.have.property("message");
                response.body.response.message.should.equal(
                  "User details updated"
                );
                done();
              });
          });
      });
  });

  it("It should delete a single user from the database /DELETE Users/:emailAddress", (done) => {
    chai
      .request(server)
      .post("/API/Users/login")
      .send({
        emailAddress: email,
        password: "password",
      })
      .end((err, responsder) => {
        let token = responsder.body.response.token;
        chai
          .request(server)
          .get("/API/Users")
          .set("x-access-token", token)
          .end((err, responder) => {
            chai
              .request(server)
              .delete(
                "/API/Users/" +
                  responder.body.response.Users[
                    responder.body.response.count - 1
                  ]["Email Address"]
              )
              .set("x-access-token", token)
              .end(function (error, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.response.should.have.property("message");
                res.body.response.message.should.be.a("string");
                res.body.response.message.should.be.eql(
                  "User deleted successfully"
                );
                done();
              });
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
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.response.should.have.property("message");
        res.body.response.Report.should.be.a("object");
        res.body.response.Report.should.have.property("Type");
        res.body.response.Report.should.have.property("Report Data");
        res.body.response.Report.should.have.property("ID");
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
        res.body.response.Reports[0].should.have.property("ID");
        res.body.response.Reports[0].should.have.property("Type");
        res.body.response.Reports[0].should.have.property("Date Captured");
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
          .get("/API/Reports/id/" + responder.body.response.Reports[0].ID)
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.response.Report.should.have.property("ID");
            res.body.response.Report.should.have.property("Type");
            res.body.response.Report.should.have.property("Report Data");
            res.body.response.Report.should.have.property("Date Captured");
            res.body.response.Report.Type.should.equal(
              responder.body.response.Reports[0]["Type"]
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
        res.body.response.Reports[0].should.have.property("ID");
        res.body.response.Reports[0].should.have.property("Type");
        res.body.response.Reports[0].should.have.property("Report Data");
        res.body.response.Reports[0].should.have.property("Date Captured");
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
            res.body.response.Reports[0].should.have.property("ID");
            res.body.response.Reports[0].should.have.property("Type");
            res.body.response.Reports[0].should.have.property("Report Data");
            res.body.response.Reports[0].should.have.property("Date Captured");
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
            response.body.response.should.have.property("message");
            response.body.response.message.should.equal(
              "Report details updated"
            );
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
            response.body.response.should.have.property("message");
            response.body.response.message.should.equal(
              "Report details updated"
            );
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
              responder.body.response.Reports[responder.body.response.count - 1]
                .ID
          )
          .send({ bActive: 0 })
          .end(function (error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a("object");
            response.body.response.should.have.property("message");
            response.body.response.message.should.equal(
              "Report details updated"
            );
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
          .delete("/API/Reports/id/" + responder.body.response.Reports[0].ID)
          .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.response.should.have.property("message");
            res.body.response.message.should.be.a("string");
            res.body.response.message.should.be.eql("Report deleted");
            done();
          });
      });
  });
});
