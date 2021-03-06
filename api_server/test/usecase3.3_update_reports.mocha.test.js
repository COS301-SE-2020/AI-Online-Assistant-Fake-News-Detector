const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../api_server");

chai.use(chaiHttp);

describe("Use Case 3.3 - Reports Update", () => {
  it("It should fetch all active reports in the reports table", function (done) {
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
        res.body.response.Reports[0].should.have.property("Report Count");
        res.body.response.Reports[0].should.have.property("Date Captured");
        done();
      });
  });

  it("It should search the reports returned and merge all duplicates.", (done) => {
    chai
      .request(server)
      .get("/API/Reports/Update")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        setTimeout(() => done(), 3000);
      });
  });

  it("It should fetch all active reports in the reports table", function (done) {
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
        res.body.response.Reports[0].should.have.property("Report Count");
        res.body.response.Reports[0].should.have.property("Date Captured");
        done();
      });
  });
});
