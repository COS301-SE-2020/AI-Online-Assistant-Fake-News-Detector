const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Logger = require("../../../winston");
const logger = new Logger(express);
const Source = require("../models/source");

/**
 * @description get request to return all known fake news sources
 * @author Quinton Coetzee
 */
router.get("/", (req, res, next) => {
  Source.find()
    .select("name tld _id rating")
    .exec()
    .then((docs) => {
      const response = {
        response: {
          success: true,
          message: "Sources retrieved successfully",
          count: docs.length,
          Sources: docs.map((doc) => {
            return {
              ID: doc._id,
              Name: doc.name,
              "Domain Name": doc.tld,
              Rating: doc.rating,
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
 * @description post request to create a new fake news sources
 * @author Quinton Coetzee
 */
router.post("/", (req, res, next) => {
  const source = new Source({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    tld: req.body.tld,
    rating: req.body.rating,
  });
  source
    .save()
    .then((result) => {
      logger.info("Source was created.");
      res.status(201).json({
        response: {
          message: "Source created successfully",
          Source: {
            ID: result.id,
            Name: result.name,
            "Domain Name": result.tld,
            Rating: result.rating,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
    });
  });
  
  /**
   * @description get request to get a single fake news source by id
   * @author Quinton Coetzee
   */
  router.get("/id/:sourceId", (req, res, next) => {
    const id = req.params.sourceId;
    Source.findById(id)
    .select("name tld rating _id")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          response: {
            message: "Retrieved source successfully",
            success: true,
            Source: {
              ID: doc.id,
              Name: doc.name,
              "Domain Name": doc.tld,
              Rating: doc.rating,
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
   * @description get source by name
   * @author Quinton Coetzee
   */
  router.get("/name/:sourceName", (req, res, next) => {
    const name = decodeURI(req.params.sourceName);
    Source.findOne({ name: new RegExp(name, "i") })
    .select("name tld rating _id")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          response: {
            message: "Retrieved source successfully",
            success: true,
            Source: {
              ID: doc.id,
              Name: doc.name,
              "Domain Name": doc.tld,
              Rating: doc.rating,
            },
          },
        });
      } else {
        res.status(404).json({
          response: {
            message: "No database entry for provided name",
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
   * @description put request to update rating of news source based on ID
   * @author Quinton Coetzee
   */
  router.put("/id/:sourceId", (req, res, next) => {
    const id = req.params.sourceId;
    Source.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      // Entry found and modified
      if (result.nModified > 0 && result.n > 0) {
        logger.info("Source was updated.");
        res.status(200).json({
          response: {
            message: "Source details updated",
            success: true,
          },
        });
      } // Found but not modified
      else if (result.nModified == 0 && result.n > 0) {
        res.status(202).json({
          response: {
            message: "No sources updated",
            success: true,
          },
        });
      } // Not found
      else {
        res.status(404).json({
          response: {
            message: "No sources updated",
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
 * @description delete request to delete a known fake news source
 * @author Quinton Coetzee
 */
router.delete("/id/:sourceId", (req, res, next) => {
  const id = req.params.sourceId;
  Source.deleteOne({ _id: id })
  .exec()
  .then((result) => {
    logger.info("Source was deleted.");
    if (result.deletedCount > 0)
    res.status(200).json({
      response: {
        message: "Source deleted",
        success: true,
      },
    });
    else
    res.status(404).json({
      response: {
        message: "Source not deleted",
        success: false,
      },
    });
  })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});

module.exports = router;
