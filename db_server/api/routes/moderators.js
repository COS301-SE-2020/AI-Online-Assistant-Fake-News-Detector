const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Logger = require("../../../winston");
const logger = new Logger(router);
const Moderator = require("../models/moderator");

/**
 * @description get request to return all moderators
 * @author Stuart Barclay
 */
router.get("/", (req, res, next) => {
  Moderator.find()
    .select("_id fName lName emailAddress authenticationLevel")
    .exec()
    .then((moderators) => {
      const response = {
        response: {
          success: true,
          count: moderators.length,
          Moderators: moderators.map((moderator) => {
            return {
              ID: moderator._id,
              Name: moderator.fName + " " + moderator.lName,
              "Email Address": moderator.emailAddress,
              "Authentication Level": moderator.authenticationLevel,
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
 * @description post request to create a new moderator
 * @author Stuart Barclay
 */
router.post("/", (req, res, next) => {
  bcrypt.hash(req.body.password, 6, (err, hash) => {
    if (err) throw err;
    const moderator = new Moderator({
      _id: new mongoose.Types.ObjectId(),
      emailAddress: req.body.emailAddress,
      password: hash,
      fName: req.body.fName,
      lName: req.body.lName,
      phoneNumber: req.body.phoneNumber,
    });
    moderator["authenticationLevel"] =
      req.body.authenticationLevel !== "" ? req.body.authenticationLevel : "";
    moderator
      .save()
      .then((result) => {
        logger.info("Moderator was created.");
        res.status(201).json({
          response: {
            message: "Moderator created successfully",
            success: true,
            Moderator: {
              ID: result.id,
              Name: result.fName + " " + result.lName,
              "Email Address": result.emailAddress,
              "Phone Number": result.phoneNumber,
              "Authentication Level": result.authenticationLevel,
            },
          },
        });
      })
      .catch((err) => {
        res.status(500).json({ response: { message: err, success: false } });
      });
  });
});

/**
 * @description get request to find a single user
 * @author Stuart Barclay
 */
router.get("/emailAddress/:emailAddress", (req, res, next) => {
  const id = req.params.emailAddress;
  Moderator.findOne(
    { emailAddress: id },
    "_id fName lName emailAddress phoneNumber authenticationLevel"
  )
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          response: {
            message: "Retrieved moderator successfully",
            success: true,
            Moderator: {
              ID: doc._id,
              Name: doc.fName + " " + doc.lName,
              "Email Address": doc.emailAddress,
              "Phone Number": doc.phoneNumber,
              "Authentication Level": doc.authenticationLevel,
            },
          },
        });
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
 * @description get request to find a single user
 * @author Stuart Barclay
 */
router.get("/id/:moderatorId", (req, res, next) => {
  const id = req.params.moderatorId;
  Moderator.findOne(
    { _id: id },
    "_id fName lName emailAddress phoneNumber authenticationLevel"
  )
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          response: {
            message: "Retrieved moderator successfully",
            success: true,
            Moderator: {
              ID: doc._id,
              Name: doc.fName + " " + doc.lName,
              "Email Address": doc.emailAddress,
              "Phone Number": doc.phoneNumber,
              "Authentication Level": doc.authenticationLevel,
            },
          },
        });
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
 * @description put request to update a moderators details based on the moderators ID
 * @author Stuart Barclay
 */
router.put("/:emailAddress", (req, res, next) => {
  const id = req.params.emailAddress;
  if (req.body.password !== undefined && req.body.password !== null) {
    // 6 = salt length
    bcrypt.hash(req.body.password, 6, (err, hash) => {
      req.body.password = hash;
      Moderator.updateOne({ emailAddress: id }, { $set: req.body })
        .exec()
        .then((result) => {
          logger.info("Moderator was Updated.");
          // Entry found and modified
          if (result.nModified > 0 && result.n > 0) {
            res.status(200).json({
              response: {
                message: "Moderator details updated",
                success: true,
              },
            });
          } // Found but not modified
          else if (result.nModified == 0 && result.n > 0) {
            res.status(202).json({
              response: {
                message: "No details updated",
                success: true,
              },
            });
          } // Not found
          else {
            res.status(404).json({
              response: {
                message: "No details updated",
                success: false,
              },
            });
          }
        })
        .catch((err) => {
          res.status(500).json({ response: { message: err, success: false } });
        });
    });
  } else {
    Moderator.updateOne({ emailAddress: id }, { $set: req.body })
      .exec()
      .then((result) => {
        logger.info("Moderator was Updated.");
        // Entry found and modified
        if (result.nModified > 0 && result.n > 0) {
          res.status(200).json({
            response: {
              message: "Moderator details updated",
              success: true,
            },
          });
        } // Found but not modified
        else if (result.nModified == 0 && result.n > 0) {
          res.status(202).json({
            response: {
              message: "No details updated",
              success: true,
            },
          });
        } // Not found
        else {
          res.status(404).json({
            response: {
              message: "No details updated",
              success: false,
            },
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ response: { message: err, success: false } });
      });
  }
});

/**
 * @description delete request to delete a modertor
 * @author Stuart Barclay
 */
router.delete("/:emailAddress", (req, res, next) => {
  Moderator.deleteOne({ emailAddress: decodeURI(req.params.emailAddress) })
    .exec()
    .then((result) => {
      logger.info("Moderator was Deleted.");
      if (result.deletedCount > 0)
        res.status(200).json({
          response: {
            message: "Moderator deleted successfully",
            success: true,
          },
        });
      else
        res.status(404).json({
          response: {
            message: "Moderator not deleted",
            success: false,
          },
        });
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});

/**
 * @description post request to login
 * @author Stuart Barclay
 */
router.post("/login", (req, res, next) => {
  Moderator.findOne(
    { emailAddress: req.body.emailAddress },
    "_id emailAddress password"
  )
    .exec()
    .then((result) => {
      bcrypt.compare(req.body.password, result.password, (err, isMatch) => {
        if (err) throw err;
        else if (!isMatch)
          res.status(200).json({
            response: {
              message: "Incorrect username or password",
              success: false,
              id: null,
            },
          });
        else
          res.status(200).json({
            response: {
              message: "Login successful",
              success: true,
              id: result._id,
            },
          });
      });
    })
    .catch((err) => {
      res.status(500).json({ response: { message: err, success: false } });
    });
});

module.exports = router;
