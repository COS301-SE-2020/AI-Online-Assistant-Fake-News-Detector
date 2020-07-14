const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

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
        count: docs.length,
        sources: docs.map((doc) => {
          return {
            name: doc.name,
            tld: doc.tld,
            rating: doc.rating,
            _id: doc._id,
            request: {
              type: "GET",
              url: "/Sources/" + doc._id,
            },
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
      res.status(201).json({
        message: "Created source successfully",
        createdSource: {
          _id: result.id,
          name: result.name,
          tld: result.tld,
          rating: result.rating,
          request: {
            type: "POST",
            url: "/Sources/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});
/**
 * @description get request to get a single fake news source by id
 * @author Quinton Coetzee
 */
router.get("/:sourceId", (req, res, next) => {
  const id = req.params.sourceId;
  Source.findById(id)
    .select("name tld rating _id")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          source: doc,
          request: {
            type: "GET",
            url: "/Sources/",
          },
        });
      } else {
        res.status(404).json({ message: "No database entry for provided ID" });
      }
    })
    .catch((err) => {

      res.status(500).json({ error: err });
    });
});
/**
 * @description put request to update rating of news source based on ID
 * @author Quinton Coetzee
 */
router.put("/:sourceId", (req, res, next) => {
  const id = req.params.sourceId;
  Source.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Source Updated",
        request: {
          type: "PUT",
          description: "URL to get updated source",
          url: "/Sources/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

/**
 * @description delete request to delete a known fake news source
 * @author Quinton Coetzee
 */
router.delete("/:sourceId", (req, res, next) => {
  const id = req.params.sourceId;
  Source.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Source Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
module.exports = router;
