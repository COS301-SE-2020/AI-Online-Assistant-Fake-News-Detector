const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
        count: moderators.length,
        moderators: moderators.map((moderator) => {
          return {
            _id: moderator._id,
            Name: moderator.fName + " " + moderator.lName,
            "Email Address": moderator.emailAddress,
            "Authentication Level": moderator.authenticationLevel,
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
 * @description post request to create a new moderator
 * @author Stuart Barclay
 */
router.post("/", (req, res, next) => {
  bcrypt.hash(req.body.password, 6, (err, hash) => {
    const moderator = new Moderator({
      _id: new mongoose.Types.ObjectId(),
      emailAddress: req.body.emailAddress,
      password: req.body.password,
      fName: req.body.fName,
      lName: req.body.lName,
      phoneNumber: req.body.phoneNumber,
    });
    moderator
      .save()
      .then((result) => {
        res.status(200).json({
          message: "Successfully added new moderator",
          "Moderator Details": {
            _id: result.id,
            emailAddress: result.emailAddress,
            fName: result.fName,
            lName: result.lName,
            phoneNumber: result.phoneNumber,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
});

/**
 * @description get request to find a single user
 * @author Stuart Barclay
 */
router.get("/:emailAddress", (req, res, next) => {
  const id = req.params.emailAddress;
  Moderator.findOne(
    { emailAddress: id },
    "_id fName lName emailAddress authenticationLevel"
  )
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          _id: doc._id,
          Name: doc.fName + " " + doc.lName,
          "Email Address": doc.emailAddress,
          "Authentication Level": doc.authenticationLevel,
        });
      } else {
        res.status(404).json({
          message: "No database entry for provided user name",
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description put request to update a moderators details based on the moderators ID
 * @author Stuart Barclay
 */
router.put("/:emailAddress", (req, res, next) => {
  const id = req.params.emailAddress;
  if (req.body.password !== undefined && req.body.password !== null) {
    bcrypt.hash(req.body.password, 6, (err, hash) => {
      req.body.password = hash;
    });
  }
  Moderator.updateOne({ emailAddress: id }, { $set: req.body })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Moderator Details Updated",
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description delete request to delete a modertor
 * @author Stuart Barclay
 */
router.delete("/:emailAddress", (req, res, next) => {
  const id = req.params.emailAddress;
  Moderator.remove({ emailAddress: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Moderator deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
module.exports = router;
