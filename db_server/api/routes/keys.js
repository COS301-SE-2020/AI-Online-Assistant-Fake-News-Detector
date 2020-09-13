const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Logger = require("../../../winston");
const logger = new Logger(express);
const Key = require("../models/key");

/**
 * @description get request for all keys
 * @author Quinton Coetzee
*/
router.get("/", (req, res, next) => {
  Key.find()
    .select("_id description key")
    .exec()
    .then((docs) => {
      const response = {
        response: {
          message: "Keys retrieved successfully",
          success: true,
          count: docs.length,
          Keys: docs.map((doc) => {
            return {
              ID: doc._id,
              Description: doc.description,
              Key: doc.key,
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
 * @description post request to add a key
 * @author Quinton Coetzee
 */
router.post("/", (req, res, next) => {
  const key = new Key({
    _id: new mongoose.Types.ObjectId(),
    description: req.body.description,
    key: req.body.key,
  });
  key
  .save()
  .then((result) => {
    logger.info("Key was created.");
    res.status(201).json({
      response: {
        message: "Key created successfully",
        success: true,
        Fact: {
          ID: result.id,
          Description: result.description,
          Key: result.key,
        },
      },
    });
  })
  .catch((err) => {
    res.status(500).json({ response: { message: err, success: false } });
  });
});

/**
 * @description get request to get a single key by Description
 * @author Quinton Coetzee
 */
router.get("/:keyDescription", (req, res, next) => {
    const description = decodeURI(req.params.keyDescription);
    Key.findOne({ description: new RegExp(description, "i") })
    .select("_id description key")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          response: {
            message: "Retrieved key successfully",
            success: true,
            Key: {
              ID: doc.id,
              Description: doc.description,
              Key: doc.key,
            },
          },
        });
      } else {
        res.status(404).json({
          response: {
            message: "No database entry for provided description",
            success: false,
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
    });
  });
module.exports = router;
