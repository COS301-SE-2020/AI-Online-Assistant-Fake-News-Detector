const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../api_server");

chai.use(chaiHttp);
describe("API-DB Integration, Get and Update", () => {
  it("It should get a full list of available sources", (done) => {
    chai
      .request(server)
      .get("/API/Sources")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.sources[0].should.have.property("_id");
        res.body.sources[0].should.have.property("name");
        res.body.sources[0].should.have.property("rating");
        res.body.sources[0].should.have.property("tld");
        done();
      });
  });

  it("It should get the top available source based on name and update its rating", (done) => {
    const source = {
      rating: "300",
    };
    chai
      .request(server)
      .get("/API/Sources")
      .end((err, responder) => {
        chai
          .request(server)
          .get(
            "/API/Sources/name/" + encodeURI(responder.body["sources"][0].name)
          )
          .end((err, res) => {
            chai
              .request(server)
              .put("/API/Sources/" + res.body["source"]._id)
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
  });
});
