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
        res.body.response.Reports[0].should.have.property("ID");
        res.body.response.Reports[0].should.have.property("Type");
        res.body.response.Reports[0].should.have.property("Report Data");
        res.body.response.Reports[0].should.have.property("Report Count");
        res.body.response.Reports[0].should.have.property("Date Captured");
        res.body.response.Reports[0].should.have.property("Active Status");
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
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("response");
        res.body.response.should.have.property("message");
        res.body.response.Report.should.be.a("object");
        res.body.response.Report.should.have.property("Type");
        res.body.response.Report.should.have.property("Report Data");
        res.body.response.Report.should.have.property("ID");
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
        res.body.response.Reports[0].should.have.property("ID");
        res.body.response.Reports[0].should.have.property("Type");
        res.body.response.Reports[0].should.have.property("Report Data");
        res.body.response.Reports[0].should.have.property("Report Count");
        res.body.response.Reports[0].should.have.property("Date Captured");
        res.body.response.Reports[0].should.have.property("Active Status");
        done();
      });
  });
});
