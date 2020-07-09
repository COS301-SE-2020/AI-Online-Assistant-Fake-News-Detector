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
              description: "URL to get specific source",
              url: "http://localhost:3000/sources/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      // console.log(err);
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
      // console.log(result);
      res.status(201).json({
        message: "Created source successfully",
        createdSource: {
          _id: result.id,
          name: result.name,
          tld: result.tld,
          rating: result.rating,
          request: {
            type: "GET",
            description: 'URL to get new source',
            url: "http://localhost:3000/sources/" + result._id,
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
    .select('name tld rating _id')
    .exec()
    .then((doc) => {
      // console.log("From Database", doc);
      if (doc) {
        res.status(200).json({ 
          source: doc,
          request: {
            type: 'GET',
            description: 'URL to get all sources',
            url: 'http://localhost:3000/sources/'
          }  
        });
      } else {
        res.status(404).json({ message: "No database entry for provided ID" });
      }
    })
    .catch((err) => {
      // console.log(err);
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
        message: 'Source Rating Updated',
        request: {
          type: 'GET',
          description: 'URL to get updated source',
          url: 'http://localhost:3000/sources/'+id
        } 
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @description delete request to delete a known fake news source
 * @author Quinton Coetzee
 */
router.delete("/:sourceId", (req, res, next) => {
  const id = req.params.sourceId;
  Source.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Source deleted"
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});
module.exports = router;
