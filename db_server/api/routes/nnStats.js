const express = require("express");
const router = express.Router();
const path = require("path");
const root = require(path.join("../", "../", "../", "Util", "path"));
const mongoose = require("mongoose");
const Logger = require(path.join(root, "winston"));
const logger = new Logger(express);
const nnStat = require("../models/nnStat");

/**
 * @author Stuart Barclay
 */
router.get("/", (req, res, next) => {
  nnStat
    .find()
    .select("_id iTrainingTime iTrainingCount dCaptured")
    .exec()
    .then(docs => {
      const response = {
        response: {
          message: "nnStats retrieved successfully",
          success: true,
          count: docs.length,
          NNStats: docs.map(doc => {
            return {
              ID: doc._id,
              Training_Time: doc.iTrainingTime,
              Training_Set_Count: doc.iTrainingCount,
              dDate: doc.dCaptured
            };
          })
        }
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});

/**
 * @author Stuart Barclay
 */
router.post("/", (req, res, next) => {
  const nnStat = new nnStat({
    _id: new mongoose.Types.ObjectId(),
    trainingTime: req.body.time,
    setCount: req.body.iTrainingCount
  });
  nnStat
    .save()
    .then(result => {
      logger.info("nnStat was created.");
      res.status(201).json({
        response: {
          message: "nnStat created successfully",
          success: true,
          NNStat: {
            ID: result._id,
            Training_Time: result.iTrainingTime,
            Training_Set_Count: result.iTrainingCount,
            dDate: result.dCaptured
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});

/**
 * @author Stuart Barclay
 */
router.get("/id/:nnStatId", (req, res, next) => {
  const id = req.params.nnStatId;
  nnStat
    .findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          response: {
            message: "Retrieved nnStat successfully",
            success: true,
            NNStat: {
              ID: doc._id,
              Training_Time: doc.iTrainingTime,
              Training_Set_Count: doc.iTrainingCount,
              dDate: doc.dCaptured
            }
          }
        });
      } else {
        res.status(404).json({
          response: {
            message: "No database entry for provided ID",
            success: false
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});

/**
 * @author Stuart Barclay
 */
router.get("/last", (req, res, next) => {
  nnStat
    .find({})
    .sort({ _id: -1 })
    .limit(1)
    .select("_id iTrainingTime iTrainingCount dCaptured")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          response: {
            message: "Retrieved nnStat successfully",
            success: true,
            NNStat: {
              ID: doc._id,
              Training_Time: doc.iTrainingTime,
              Training_Set_Count: doc.iTrainingCount,
              dDate: doc.dCaptured
            }
          }
        });
      } else {
        res.status(404).json({
          response: {
            message: "No database entry for provided ID",
            success: false
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});

/**
 * @author Stuart Barclay
 */
router.delete("/:nnStatId", (req, res, next) => {
  const id = req.params.nnStatId;
  nnStat
    .deleteOne({ _id: id })
    .exec()
    .then(result => {
      logger.info("nnStat was Deleted.");
      if (result.deletedCount > 0) {
        res.status(200).json({
          response: {
            message: "nnStat deleted successfully",
            success: true
          }
        });
      } else {
        res.status(404).json({
          response: {
            message: "nnStat not deleted",
            success: false
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});

module.exports = router;
