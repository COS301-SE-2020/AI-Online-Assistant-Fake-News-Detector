const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Source = require('../models/source');

/**
 * @description get request to return all known fake news sources
 * @author Quinton Coetzee
 */
router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'Incoming get request'
    });
});
/**
 * @description post request to create a new fake news sources
 * @author Quinton Coetzee
 */
router.post('/', (req, res, next)=>{
    const source = new Source({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        tld: req.body.tld,
        rating: req.body.rating
    });
    source
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling Source POST requests',
            createdSource: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});
/**
 * @description get request to get a single fake news source by id
 * @author Quinton Coetzee
 */
router.get('/:sourceId',(req, res, next)=>{
    const id = req.params.sourceId;
    Source.findById(id)
        .exec()
        .then(doc => {
            console.log("From Database",doc);
            if (doc) {
                res.status(200).json({doc});
            } else {
                res.status(404).json({message: 'No valid entry for provided ID'});
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err});
        });
});
/**
 * @description put request to update rating of news source based on ID
 * @author Quinton Coetzee
 */
router.put('/:sourceId',(req, res, next)=>{
    res.status(200).json({
        message: 'Updated source rating!'
    });
});
/**
 * @description delete request to delete a known fake news source
 * @author Quinton Coetzee
 */
router.delete('/:sourceId',(req, res, next)=>{
    res.status(200).json({
        message: 'Removed Source!'
    });
});
module.exports = router;