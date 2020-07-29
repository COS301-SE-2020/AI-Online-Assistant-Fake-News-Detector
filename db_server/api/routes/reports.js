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
        response: {
          message: "Report created successfully",
          success: true,
          count: reports.length,
          Reports: reports.map((report) => {
            return {
              ID: report._id,
              Type:
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
        },
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
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
      res.status(201).json({
        response: {
          message: "Report created successfully",
          success: true,
          Report: {
            ID: result.id,
            Type:
              result.type == 1
                ? "Fact"
                : result.type == 2
                ? "Source"
                : "undefined",
            "Report Data": result.description,
            "Date Captured": result.dCaptured,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
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
          response: {
            message: "Retrieved report successfully",
            success: true,
            Report: {
              ID: doc._id,
              Type:
                doc.type == 1 ? "Fact" : doc.type == 2 ? "Source" : "undefined",
              "Report Data": doc.description,
              "Date Captured": doc.dCaptured,
              "Report Count": doc.reportCounter,
              "Active Status": doc.bActive,
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
          response: {
            message: "Retrieved reports successfully",
            success: true,
            count: reports.length,
            Reports: reports.map((report) => {
              return {
                ID: report._id,
                Type:
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
          },
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          response: {
            message: "No database entry for provided active status",
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
      if (reports.length > 0) {
        const response = {
          response: {
            message: "Retrieved reports successfully",
            success: true,
            count: reports.length,
            Reports: reports.map((report) => {
              return {
                ID: report._id,
                Type:
                  report.type == 1
                    ? "Fact"
                    : report.type == 2
                    ? "Source"
                    : "undefined",
                "Report Data": report.description,
                "Date Captured": report.dCaptured,
                "Report Count": report.reportCount,
                "Active Status": report.bActive,
              };
            }),
          },
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          response: {
            message: "No database entry for provided email address",
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
 * @description put request to update a reports details based on the reports ID
 * @author Stuart Barclay
 */
router.put("/id/:id", (req, res, next) => {
  const id = req.params.id;
  Report.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      // Entry found and modified
      if (result.nModified > 0 && result.n > 0) {
        res.status(200).json({
          response: {
            message: "Report details updated",
            success: true,
          },
        });
      } // Found but not modified
      else if (result.nModified == 0 && result.n > 0) {
        res.status(304).json({
          response: {
            message: "No reports updated",
            success: true,
          },
        });
      } // Not found
      else {
        res.status(404).json({
          response: {
            message: "No reports updated",
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
 * @description put request to update a reports details based on the reports active status
 * @author Stuart Barclay
 */
router.put("/active/:active", (req, res, next) => {
  Report.updateMany({ bActive: req.params.active }, { $set: req.body })
    .exec()
    .then((result) => {
      // Entry found and modified
      if (result.nModified > 0 && result.n > 0) {
        res.status(200).json({
          response: {
            message: "Report details updated",
            success: true,
          },
        });
      } // Found but not modified
      else if (result.nModified == 0 && result.n > 0) {
        res.status(304).json({
          response: {
            message: "No reports updated",
            success: true,
          },
        });
      } // Not found
      else {
        res.status(404).json({
          response: {
            message: "No reports updated",
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
 * @description put request to update a reports details based on the reports active status
 * @author Stuart Barclay
 */
router.put("/type/:type", (req, res, next) => {
  Report.updateMany({ type: req.params.type }, { $set: req.body })
    .exec()
    .then((result) => {
      // Entry found and modified
      if (result.nModified > 0 && result.n > 0) {
        res.status(200).json({
          response: {
            message: "Report details updated",
            success: true,
          },
        });
      } // Found but not modified
      else if (result.nModified == 0 && result.n > 0) {
        res.status(304).json({
          response: {
            message: "No reports updated",
            success: true,
          },
        });
      } // Not found
      else {
        res.status(404).json({
          response: {
            message: "No reports updated",
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
 * @description delete request to delete a report based on its ID
 * @author Stuart Barclay
 */
router.delete("/id/:id", (req, res, next) => {
  Report.deleteOne({ _id: req.params.id })
    .exec()
    .then((result) => {
      if (result.deletedCount > 0)
        res.status(200).json({
          response: {
            message: "Report deleted",
            success: true,
          },
        });
      else
        res.status(404).json({
          response: {
            message: "Report not deleted",
            success: false,
          },
        });
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
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
      if (result.deletedCount > 0)
        res.status(200).json({
          response: {
            message: "Reports deleted",
            success: true,
          },
        });
      else
        res.status(404).json({
          response: {
            message: "Reports not deleted",
            success: false,
          },
        });
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});

module.exports = router;
