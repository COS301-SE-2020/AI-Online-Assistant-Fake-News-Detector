// const assert = require("assert");
const chaihttp = require("chai-http");
const chai = require("chai");
process.env.NODE_ENV = "dev";
const server = require("../db_server");
const { expect } = require("chai");
const { response, resource } = require("../../api_server/api_server");

//Assertion Style
chai.should();

chai.use(chaihttp);
/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////   SOURCES   ////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
describe("Sources Api", () => {
  it("It should POST a test source", (done) => {
    const source = {
      name: "mocha_test_news_source",
      tld: "www.mochatest.com",
      rating: 500,
    };
    chai
      .request(server)
      .post("/sources")
      .send(source)
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a("object");
        response.body.response.Source.should.be.a("object");
        response.body.response.Source.Rating.should.equal(500);
        response.body.response.Source.should.have.property("Name");
        response.body.response.Source.should.have.property("Domain Name");
        response.body.response.Source.should.have.property("ID");
        response.body.response.Source.should.have.property("Rating");
        done();
      });
  });

  it("It should get all known fake news sources", (done) => {
    chai
      .request(server)
      .get("/sources")
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

  it("It should not get any known fake news sources", (done) => {
    chai
      .request(server)
      .get("/sourcey")
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });

  it("It should get a source by id", (done) => {
    chai
      .request(server)
      .get("/Sources")
      .end((err, res) => {
        chai
          .request(server)
          .get("/sources/id/" + res.body.response.Sources[0].ID)
          .end((err, response) => {
            expect(err).to.be.null;
            response.should.have.status(200);
            response.body.should.be.a("object");
            response.body.response.Source.should.have.property("ID");
            response.body.response.Source.should.have.property("Name");
            response.body.response.Source.should.have.property("Domain Name");
            response.body.response.Source.Name.should.equal(
              res.body.response.Sources[0].Name
            );
            response.body.response.Source["Domain Name"].should.equal(
              res.body.response.Sources[0]["Domain Name"]
            );
            done();
          });
      });
  });

  it("It should get NO source", (done) => {
    const sourceId = "5edf31165d617a2850632424";
    chai
      .request(server)
      .get("/sources/id/" + sourceId)
      .end((err, response) => {
        response.should.have.status(404);
        response.body.response.should.be.a("object");
        response.body.response.should.have
          .property("message")
          .eq("No database entry for provided ID");
        done();
      });
  });

  it("Post request should fail, because no name is given", (done) => {
    const source = {
      tld: "www.mochatest.com",
      rating: "500",
    };
    chai
      .request(server)
      .post("/sources")
      .send(source)
      .end((err, response) => {
        response.should.have.status(500);
        response.body.should.be.a("object");
        done();
      });
  });

  it("It should update a source rating", (done) => {
    const source = {
      rating: 550,
    };
    chai
      .request(server)
      .get("/sources")
      .end((err, res) => {
        chai
          .request(server)
          .put(
            "/sources/id/" +
              res.body.response.Sources[res.body.response.Sources.length - 1].ID
          )
          .send(source)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a("object");
            response.body.response.should.have.property("message");
            response.body.response.message.should.equal(
              "Source details updated"
            );
            done();
          });
      });
  });

  it("It should GET a source based on name", (done) => {
    chai
      .request(server)
      .get("/sources")
      .end((err, res) => {
        chai
          .request(server)
          .get("/sources/name/" + encodeURI(res.body.response.Sources[0].Name))
          .end((err, response) => {
            expect(err).to.be.null;
            response.should.have.status(200);
            response.body.response.should.be.a("object");
            response.body.response.Source.should.have.property("ID");
            response.body.response.Source.should.have.property("Name");
            response.body.response.Source.should.have.property("Domain Name");
            response.body.response.Source.Name.should.equal(
              decodeURI(res.body.response.Sources[0].Name)
            );
            response.body.response.Source["Domain Name"].should.equal(
              res.body.response.Sources[0]["Domain Name"]
            );
            done();
          });
      });
  });

  it("It should delete a single source", (done) => {
    chai
      .request(server)
      .get("/sources")
      .end((err, res) => {
        chai
          .request(server)
          .delete(
            "/sources/id/" +
              res.body.response.Sources[res.body.response.count - 1].ID
          )
          .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.should.have.property("response");
            res.body.response.should.have.property("message");
            res.body.response.message.should.be.a("string");
            res.body.response.message.should.be.eql("Source deleted");
            done();
          });
      });
  });
});
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////   FACTS   /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
describe("Facts Api", () => {
  it("It should create a new fact in the database", (done) => {
    chai
      .request(server)
      .post("/Facts")
      .send({ statement: "db server mocha test fact", popularity: 50 })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.response.should.have.property("message");
        res.body.response.Fact.should.be.a("object");
        res.body.response.Fact.should.have.property("ID");
        res.body.response.Fact.should.have.property("Statement");
        res.body.response.Fact.should.have.property("Popularity");
        done();
      });
  });

  it("It should get all known fake facts", (done) => {
    chai
      .request(server)
      .get("/facts")
      .end((err, response) => {
        expect(err).to.be.null;
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.response.Facts[0].should.have.property("ID");
        response.body.response.Facts[0].should.have.property("Statement");
        response.body.response.Facts[0].should.have.property("Popularity");
        done();
      });
  });

  it("It should get no fake facts due to path error", (done) => {
    chai
      .request(server)
      .get("/fact")
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });

  it("It should retrieve a single fake fact from the database based on ID", (done) => {
    chai
      .request(server)
      .get("/facts")
      .end((err, res) => {
        chai
          .request(server)
          .get("/facts/" + res.body.response.Facts[0].ID)
          .end((err, response) => {
            expect(err).to.be.null;
            response.should.have.status(200);
            response.should.be.a("object");
            response.body.response.Fact.should.have.property("ID");
            response.body.response.Fact.should.have.property("Statement");
            response.body.response.Fact.should.have.property("Popularity");
            response.body.response.Fact.Popularity.should.equal(
              res.body.response.Facts[0].Popularity
            );
            response.body.response.Fact.Statement.should.equal(
              res.body.response.Facts[0].Statement
            );
            done();
          });
      });
  });

  it("It should delete a single fact from the database /DELETE facts/:factId", (done) => {
    chai
      .request(server)
      .get("/Facts")
      .end(function (err, res) {
        chai
          .request(server)
          .delete(
            "/Facts/" +
              res.body.response.Facts[res.body.response.Facts.length - 1].ID
          )
          .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            done();
          });
      });
  });
});
/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////   Users  ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
// describe("Users Api", () => {
//   it("It should add a Moderator to the database", function (done) {
//     chai
//       .request(server)
//       .post("/Users")
//       .send({
//         emailAddress: "5Bits@gmail.com",
//         password: "Stuart",
//         fName: "Stuart" + (Math.random() * 100).toFixed(0),
//         lName: "Barclay",
//         phoneNumber: "0793580784",
//       })
//       .end(function (err, res) {
//         res.should.have.status(201);
//         res.should.be.json;
//         res.body.should.be.a("object");
//         res.body.response.should.have.property("message");
//         res.body.response.Moderator.should.be.a("object");
//         res.body.response.Moderator.should.have.property("Name");
//         res.body.response.Moderator.should.have.property("Email Address");
//         res.body.response.Moderator.should.have.property("ID");
//         done();
//       });
//   });
//   it("It should get all Users from the database", (done) => {
//     chai
//       .request(server)
//       .get("/Users")
//       .end((err, response) => {
//         expect(err).to.be.null;
//         response.should.have.status(200);
//         response.body.should.be.a("object");
//         response.body.response.Users[0].should.have.property("ID");
//         response.body.response.Users[0].should.have.property("Name");
//         response.body.response.Users[0].should.have.property(
//           "Email Address"
//         );
//         done();
//       });
//   });

//   it("It should get a specific moderator based on email", (done) => {
//     chai
//       .request(server)
//       .get("/Users")
//       .end((err, res) => {
//         chai
//           .request(server)
//           .get(
//             "/Users/" + res.body.response.Users[0]["Email Address"]
//           )
//           .end((err, response) => {
//             response.should.have.status(200);
//             response.body.response.Moderator.Name.should.equal(
//               res.body.response.Users[0]["Name"]
//             );
//             done();
//           });
//       });
//   });
//   it("It should delete a single moderator from the database", function (done) {
//     chai
//       .request(server)
//       .get("/Users")
//       .end((err, responder) => {
//         chai
//           .request(server)
//           .delete(
//             "/Users/" +
//               responder.body.response.Users[
//                 responder.body.response.count - 1
//               ]["Email Address"]
//           )
//           .end(function (error, res) {
//             res.should.have.status(200);
//             res.should.be.json;
//             res.body.should.be.a("object");
//             res.body.response.should.have.property("message");
//             res.body.response.message.should.be.a("string");
//             res.body.response.message.should.be.eql(
//               "Moderator deleted successfully"
//             );
//             done();
//           });
//       });
//   });
// });
/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////   REPORTS  /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
describe("Reports Api", () => {
  it("It should add a Report to the database", function (done) {
    chai
      .request(server)
      .post("/Reports")
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
  it("It should get all reports from the database", (done) => {
    chai
      .request(server)
      .get("/Reports")
      .end((err, response) => {
        expect(err).to.be.null;
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.response.Reports[0].should.have.property("ID");
        response.body.response.Reports[0].should.have.property("Type");
        response.body.response.Reports[0].should.have.property("Date Captured");
        done();
      });
  });

  it("It should get a specific report based on id", (done) => {
    chai
      .request(server)
      .get("/Reports")
      .end((err, res) => {
        chai
          .request(server)
          .get("/Reports/id/" + res.body.response.Reports[0].ID)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.response.Report.Type.should.equal(
              res.body.response.Reports[0].Type
            );
            done();
          });
      });
  });
  it("It should delete a single report based on ID", function (done) {
    chai
      .request(server)
      .get("/Reports")
      .end((err, responder) => {
        chai
          .request(server)
          .delete("/Reports/id/" + responder.body.response.Reports[0].ID)
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
/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////   NNMODELS  ////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
describe("nnModels Api", () => {
  it("It should add a Neural Network model to the database", function (done) {
    chai
      .request(server)
      .post("/nnModels")
      .send({
        name: "testmodel",
        date: "2020-06-06",
        model: "",
      })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.response.should.have.property("message");
        res.body.response.Model.should.be.a("object");
        res.body.response.Model.should.have.property("Name");
        res.body.response.Model.should.have.property("Date");
        res.body.response.Model.should.have.property("ID");
        done();
      });
  });
  it("It should GET a nnModel based on name", (done) => {
    chai
      .request(server)
      .get("/nnModels")
      .end((err, res) => {
        chai
          .request(server)
          .get("/nnModels/" + encodeURI(res.body.response.Models[0].Name))
          .end((err, response) => {
            expect(err).to.be.null;
            response.should.have.status(200);
            response.body.response.should.be.a("object");
            response.body.response.Model.should.have.property("ID");
            response.body.response.Model.should.have.property("Name");
            response.body.response.Model.should.have.property("Date");
            response.body.response.Model.should.have.property("Model");
            response.body.response.Model.Name.should.equal(
              decodeURI(res.body.response.Models[0].Name)
            );
            done();
          });
      });
  });
  it("It should delete a Neural Network model from database", function (done) {
    chai
      .request(server)
      .get("/nnModels")
      .end((err, responder) => {
        chai
          .request(server)
          .delete("/nnModels/" + responder.body.response.Models[0].ID)
          .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.response.should.have.property("message");
            res.body.response.message.should.be.eql("Model deleted");
            done();
          });
      });
  });
});
/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////   TRAINING  ////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
describe("Training Api", () => {
  for (let counter = 0; counter < 3; counter++) {
    it("It should add a Training Record to the database", function (done) {
        chai
          .request(server)
          .post("/Training")
          .send({
            article: "Fake news mocha test article",
            fake: true,
          })
          .end(function (err, res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.response.should.have.property("message");
            res.body.response.trainingRecord.should.be.a("object");
            res.body.response.trainingRecord.should.have.property("ID");
            done();
          });
        });
  }
  it("It should get all Training Data", (done) => {
        chai
        .request(server)
        .get("/Training")
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("response");
        res.body.response.should.have.property("message");
        res.body.response.should.have.property("count");
        res.body.response.TrainingData[0].should.have.property("ID");
        res.body.response.TrainingData[0].should.have.property("Article");
        res.body.response.TrainingData[0].should.have.property("Fake");
        done();
      });
  });
  it("It should get a range of training data containing the first 2 records", function (done) {
      const range = {
        start: 0,
        amount: 2,
      };
      chai
        .request(server)
        .post("/Training/range/")
        .send(range)
        .end(function (err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.response.should.have.property("message");
          done();
        });
    });
    it("It should fail to get a range due to negative index", function (done) {
      const range = {
        start: -1,
        amount: 2,
      };
      chai
        .request(server)
        .post("/Training/range/")
        .send(range)
        .end(function (err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.response.should.have.property("message");
          done();
        });
    });  
    it("It should fail to get a range due to going over the top bound", function (done) {
      const range = {
        start: 0,
        amount: 20,
      };
      chai
        .request(server)
        .post("/Training/range/")
        .send(range)
        .end(function (err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.response.should.have.property("message");
          done();
        });
    });  
  for (let counter = 0; counter < 3; counter++) {
  it("It should delete a Training Record based on ID", function (done) {
      chai
      .request(server)
      .get("/Training")
      .end((err, responder) => {
          chai
            .request(server)
            .delete("/Training/" + responder.body.response.TrainingData[0].ID)
            .end(function (error, res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a("object");
              res.body.response.should.have.property("message");
              res.body.response.message.should.be.eql("Training Record deleted");
              done();
            });
          });
        });
        }
});
