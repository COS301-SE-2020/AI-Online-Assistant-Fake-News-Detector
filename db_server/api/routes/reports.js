const router = require("express").Router();
const mongoose = require("mongoose");

const Report = require("../models/report");

/**
 * @description get request to return all reports
 * @author Stuart Barclay
 */
router.get("/", (req, res, next) => {
  Report.find()
    .select("_id type description reportCount dCaptured bActive")
    .sort("type description")
    .exec()
    .then((reports) => {
      const response = {
        count: reports.length,
        reports: reports.map((report) => {
          return {
            _id: report._id,
            type:
              report.type == 1
                ? "Fact"
                : report.type == 2
                ? "Source"
                : "undefined",
            "Report Data": report.description,
            "Date Captured": report.dCaptured,
            "Report Count": report.reportCount,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

/**
 * @description post request to create a new report
 * @author Stuart Barclay
 */
router.post("/", (req, res, next) => {
  const report = new Report({
    _id: new mongoose.Types.ObjectId(),
    type: req.body.type,
    description: req.body.description,
  });
  report
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Successfully added new report",
        "Report Details": {
          _id: result.id,
          type:
            result.type == 1
              ? "Fact"
              : result.type == 2
              ? "Source"
              : "undefined",
          "Report Data": result.description,
          "Date Captured": result.dCaptured,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

/**
 * @description get request to find a report
 * @author Stuart Barclay
 */
router.get("/id/:id", (req, res, next) => {
  Report.findOne(
    { _id: req.params.id },
    "_id type description reportCount dCaptured bActive"
  )
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          Report: {
            _id: doc._id,
            type:
              doc.type == 1 ? "Fact" : doc.type == 2 ? "Source" : "undefined",
            "Report Data": doc.description,
            "Date Captured": doc.dCaptured,
            "Report Count": report.reportCounter,
          },
        });
      } else {
        res.status(404).json({
          message: "No database entry for provided report ID",
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description get request to find reports based on their active status
 * @author Stuart Barclay
 */
router.get("/active/:active", (req, res, next) => {
  Report.find(
    { bActive: req.params.active },
    "_id type description reportCount dCaptured bActive"
  )
    .sort("type description")
    .exec()
    .then((reports) => {
      if (reports) {
        const response = {
          count: reports.length,
          reports: reports.map((report) => {
            return {
              _id: report._id,
              type:
                report.type == 1
                  ? "Fact"
                  : report.type == 2
                  ? "Source"
                  : "undefined",
              "Report Data": report.description,
              "Date Captured": report.dCaptured,
              "Report Count": report.reportCount,
            };
          }),
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No database entry for provided report ID",
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description get request to find reports based on their type
 * @author Stuart Barclay
 */
router.get("/type/:type", (req, res, next) => {
  Report.find(
    { type: req.params.type },
    "_id type description reportCount dCaptured bActive"
  )
    .sort("type description")
    .exec()
    .then((reports) => {
      if (reports) {
        const response = {
          count: reports.length,
          reports: reports.map((report) => {
            return {
              _id: report._id,
              type:
                report.type == 1
                  ? "Fact"
                  : report.type == 2
                  ? "Source"
                  : "undefined",
              "Report Data": report.description,
              "Date Captured": report.dCaptured,
              "Report Count": report.reportCount,
            };
          }),
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No database entry for provided report ID",
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description put request to update a reports details based on the reports ID
 * @author Stuart Barclay
 */
router.put("/id/:id", (req, res, next) => {
  console.log(req.body);
  const id = req.params.id;
  Report.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Report Updated",
        result: result,
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description put request to update a reports details based on the reports active status
 * @author Stuart Barclay
 */
router.put("/active/:active", (req, res, next) => {
  console.log(req.body);
  Report.updateMany({ bActive: req.params.active }, { $set: req.body })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Report Updated",
        result: result,
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description put request to update a reports details based on the reports active status
 * @author Stuart Barclay
 */
router.put("/type/:type", (req, res, next) => {
  Report.updateMany({ type: req.params.type }, { $set: req.body })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Report Updated",
        result: result,
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description delete request to delete a report based on its ID
 * @author Stuart Barclay
 */
router.delete("/id/:id", (req, res, next) => {
  Report.deleteOne({ _id: req.params.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Report deleted",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

/**
 * @description delete request to delete a report based on its active status
 * @author Stuart Barclay
 */
router.delete("/active/:active", (req, res, next) => {
  Report.deleteMany({ bActive: req.params.active })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Report deleted",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
