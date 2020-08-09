const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Logger = require("../../../winston");
const logger = new Logger(express);
const nnModel = require("../models/nnModel");

/**
 * @description get request for all known stored neural network models
 * @author Quinton Coetzee
 */
router.get("/", (req, res, next) => {
  nnModel
    .find()
    .select("_id name date model")
    .exec()
    .then((docs) => {
      const response = {
        response: {
          message: "Models retrieved successfully",
          success: true,
          count: docs.length,
          Models: docs.map((doc) => {
            return {
              ID: doc._id,
              Name: doc.name,
              Date: doc.date,
              Model: doc.model,
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
 * @description post request to store a new model
 * @author Quinton Coetzee
 */
router.post("/", (req, res, next) => {
  const nnmodel = new nnModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    // date: req.body.date,
    date: new Date(),
    model: toString(req.body.model),
  });
  nnmodel
    .save()
    .then((result) => {
      logger.info("New nnModel was created.");
      res.status(201).json({
        response: {
          message: "New Neural Network model stored successfully",
          success: true,
          Model: {
            ID: result.id,
            Name: result.name,
            Date: result.date,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});

/**
 * @description get request to get a single model by name
 * @author Quinton Coetzee
 */
router.get("/:modelName", (req, res, next) => {
  const name = decodeURI(req.params.modelName);
  nnModel
    .findOne({ name: new RegExp(name, "i") })
    .select("_id name date model")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          response: {
            message: "Retrieved model successfully",
            success: true,
            Model: {
              ID: doc._id,
              Name: doc.name,
              Date: doc.date,
              Model: doc.model,
            },
          },
        });
      } else {
        res.status(404).json({
          response: {
            message: "No model for provided name",
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
 * @description delete single model by id
 * @author Quinton Coetzee
 */
router.delete("/:modelId", (req, res, next) => {
  const id = req.params.modelId;
  nnModel
    .deleteOne({ _id: id })
    .exec()
    .then((result) => {
      logger.info("nnModel was deleted.");
      if (result.deletedCount > 0)
        res.status(200).json({
          response: {
            message: "Model deleted",
            success: true,
          },
        });
      else
        res.status(404).json({
          response: {
            message: "Model not deleted",
            success: false,
          },
        });
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});
module.exports = router;
