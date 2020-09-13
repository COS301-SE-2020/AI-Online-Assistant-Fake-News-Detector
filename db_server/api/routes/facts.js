const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Logger = require("../../../winston");
const logger = new Logger(express);
const Fact = require("../models/fact");
const got = require("got");

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
        response: {
          message: "Facts retrieved successfully",
          success: true,
          count: docs.length,
          Facts: docs.map((doc) => {
            return {
              ID: doc._id,
              Statement: doc.statement,
              Popularity: doc.popularity,
            };
          }),
        },
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
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
      logger.info("Fact was created.");
      res.status(201).json({
        response: {
          message: "Fact created successfully",
          success: true,
          Fact: {
            ID: result.id,
            Statement: result.statement,
            Popularity: result.popularity,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
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
      if (doc) {
        res.status(200).json({
          response: {
            message: "Retrieved fact successfully",
            success: true,
            Fact: {
              ID: doc._id,
              Statement: doc.statement,
              Popularity: doc.popularity,
            },
          },
        });
      } else {
        res.status(404).json({
          response: {
            message: "No database entry for provided ID",
            success: false,
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
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
      logger.info("Fact was Deleted.");
      if (result.deletedCount > 0) {
        res.status(200).json({
          response: {
            message: "Fact deleted successfully",
            success: true,
          },
        });
      } else {
        res.status(404).json({
          response: {
            message: "Fact not deleted",
            success: false,
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});
/**
 * @description post request to check a fact on the Google Check API
 * @author Quinton Coetzee
 */
router.post("/factCheck/", (req, res, next) => {
  const statement = req.body.statement;
  if (statement === "") {
    res.status(500).json({ response: { message: "err", success: false } });
  }
  let apiKey = "";
  (async () => {
    const { body } = await got.get(
      "http://localhost:3000/keys/GoogleFactAPI/",
      {
        responseType: "json",
      }
    );
    apiKey = body.response.Key.Key;
    let googleURL =
      "https://factchecktools.googleapis.com/v1alpha1/claims:search?key=";
    googleURL += apiKey;
    googleURL += "&pageSize=1&languageCode=enUS&query=";
    googleURL += statement;
    (async () => {
      const { body } = await got.get(googleURL, {
        responseType: "json",
      });
      if (body.claims) {
        res.status(200).json({
          response: {
            message: "Review completed successfully.",
            text: body.claims[0].text,
            reviewer: body.claims[0].claimReview[0].publisher.name,
            review: body.claims[0].claimReview[0].textualRating,
            reviewSource: body.claims[0].claimReview[0].url,
            success: true,
          },
        });
      } else {
        res.status(404).json({
          response: {
            message: "No similar statements found.",
            success: true,
          },
        });
      }
    })();
  })();
});

module.exports = router;
