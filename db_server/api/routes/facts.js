const express = require('express');
const router = express.Router();
/**
 * @description get request for all known fake facts in the fake facts database
 * @author Quinton Coetzee
 */
router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'Facts were fetched'
    });
});
/**
 * @description post request to add a fake fact to the database
 * @author Quinton Coetzee
 */
router.post('/', (req, res, next)=>{
    const fact = {
        statement: req.body.statement,
    }
    res.status(201).json({
        message: 'Fact was created',
        fact: fact
    });
});
/**
 * @description get request to get a single fact by ID
 * @author Quinton Coetzee
 */
router.get('/:factId', (req, res, next)=>{
    res.status(200).json({
        message: 'Fact Details',
        factId: req.params.factId
    });
});
/**
 * @description delete request to remove a fake fact from the database by ID
 * @author Quinton Coetzee
 */
router.delete('/:factId', (req, res, next)=>{
    res.status(200).json({
        message: 'Fact Deleted',
        factId: req.params.factId
    });
});

module.exports = router;