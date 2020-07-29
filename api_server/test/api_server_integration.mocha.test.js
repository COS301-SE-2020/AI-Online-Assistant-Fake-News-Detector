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
              .put("/API/Sources/" + res.body.response.Source.ID)
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
});
