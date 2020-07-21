const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("./nn_server.js");

chai.use(chaiHttp);
describe("nn_server API", () => {
  it("A valid API request should return a result field with a number.", (done) => {
    chai
      .request(server)
      .post("/API/Check")
      .send({ type: "text", content: "The text to check." })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("result");
        done();
      });
  });

  it("A invalid API request should return 400 with empty body.", (done) => {
    chai
      .request(server)
      .post("/API/Check")
      .send({ type: "text", content: 0 })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.be.empty;
        done();
      });
  });
});
