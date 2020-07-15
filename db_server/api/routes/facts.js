const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Fact = require("../models/fact");

/**
 * @description get request for all known fake facts in the fake facts database
 * @author Quinton Coetzee
 */
router.get("/", (req, res, next) => {
  Fact.find()
    .select("statement popularity _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        facts: docs.map((doc) => {
          return {
            statement: doc.statement,
            popularity: doc.popularity,
            _id: doc._id,
            request: {
              type: "GET",
              url: "/Facts/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description post request to add a fake fact to the database
 * @author Quinton Coetzee
 */
router.post("/", (req, res, next) => {
  const fact = new Fact({
    _id: new mongoose.Types.ObjectId(),
    statement: req.body.statement,
    popularity: req.body.popularity,
  });
  fact
    .save()
    .then((result) => {
      // console.log(result);
      res.status(201).json({
        message: "Created fact successfully",
        createdFact: {
          _id: result.id,
          statement: result.statement,
          popularity: result.popularity,
          request: {
            type: "POST",
            url: "/Facts/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description get request to get a single fact by ID
 * @author Quinton Coetzee
 */
router.get("/:factId", (req, res, next) => {
  const id = req.params.factId;
  Fact.findById(id)
    .exec()
    .then((doc) => {
      // console.log("From Database", doc);
      if (doc) {
        res.status(200).json({ doc });
      } else {
        res.status(404).json({ message: "No database entry for provided ID" });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description delete request to remove a fake fact from the database by ID
 * @author Quinton Coetzee
 */
router.delete("/:factId", (req, res, next) => {
  const id = req.params.factId;
  Fact.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});
module.exports = router;
