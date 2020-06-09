const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const sourceRoutes = require('./api/routes/sources')
const factRoutes = require('./api/routes/facts')

mongoose.connect(
    // 'mongodb+srv://FakeNewsAdmin:' + process.env.MONGO_ATLAS_PW + '@fake-news-detector-vastj.mongodb.net/fake_news_detector?retryWrites=true&w=majority',
    "mongodb+srv://FakeNewsAdmin:murrIq-xytbud-2wubjo@fake-news-detector-vastj.mongodb.net/fake_news_detector?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//prevent CORS errors
app.use((res,req,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/sources', sourceRoutes);
app.use('/facts', factRoutes);

//Requests that passed the routes above are not supported and therefore seen as errors.
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})
//handles all other errors
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports = app;