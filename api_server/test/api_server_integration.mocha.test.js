const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../api_server");

chai.use(chaiHttp);
describe("API-DB Integration, Get and Update", () => {
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
  it("It should get a full list of available sources", (done) => {
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

  it("It should get the top available source based on name and update its rating", (done) => {
    const source = {
      // rating: 90000,
      rating: (Math.random() * 100).toFixed(0),
    };
    chai
      .request(server)
      .get("/API/Sources")
      .end((err, responder) => {
        chai
          .request(server)
          .get(
            "/API/Sources/name/" +
              encodeURI(responder.body.response.Sources[0].Name)
          )
          .end((err, res) => {
            chai
              .request(server)
              .put("/API/Sources/id/" + res.body.response.Source.ID)
              .send(source)
              .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.have.property("response");
                response.body.response.message.should.equal(
                  "Source details updated"
                );
                done();
              });
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
            console.log(res.body);
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
