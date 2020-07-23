const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../api_server");

chai.use(chaiHttp);

describe("Use Case 1.8 - Flag Source", () => {
  it("It should retrieve all statement reports and display them", (done) => {
    chai
      .request(server)
      .get("/API/Reports/type/2")
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

  it("It should add a new report", function (done) {
    chai
      .request(server)
      .post("/API/Reports")
      .send({
        type: "2",
        description: "https://bunkerkings.com",
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

  it("It should retrieve all statement reports and display them", (done) => {
    chai
      .request(server)
      .get("/API/Reports/type/2")
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
});
