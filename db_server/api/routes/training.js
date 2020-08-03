const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Logger = require("../../../winston");
const logger = new Logger(express);

const Training = require("../models/training");

/**
 * @description get request for all training data
 * @author Quinton Coetzee
 */
router.get("/", (req, res, next) => {
  Training.find()
    .select("_id article fake")
    .exec()
    .then((docs) => {
      const response = {
        response: {
          message: "Training Data retrieved successfully",
          success: true,
          count: docs.length,
          TrainingData: docs.map((doc) => {
            return {
              ID: doc._id,
              Article: doc.article,
              Fake: doc.fake,
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
 * @description post request to store new training record
 * @author Quinton Coetzee
 */
router.post("/", (req, res, next) => {
  const trainingRecord = new Training({
    _id: new mongoose.Types.ObjectId(),
    article: req.body.article,
    fake: req.body.fake
  });
  trainingRecord
    .save()
    .then((result) => {
      logger.info("Training Record was created.");
      res.status(201).json({
        response: {
          message: "New Training record stored successfully",
          success: true,
          trainingRecord: {
            ID: result.id
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
    });
  });
  
  /**
   * @description delete single training record by id
   * @author Quinton Coetzee
   */
  router.delete("/:trainingId", (req, res, next) => {
    const id = req.params.trainingId;
    Training.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      logger.info("Training Record was Deleted.");
      if (result.deletedCount > 0)
      res.status(200).json({
        response: {
          message: "Training Record deleted",
          success: true,
        },
      });
      else
      res.status(404).json({
        response: {
          message: "Training Record not deleted",
          success: false,
        },
      });
    })
    .catch((err) => {
        res.status(500).json({ response: { message: err, success: false } });
      });
  });
module.exports = router;
