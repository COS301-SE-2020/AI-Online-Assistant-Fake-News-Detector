const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const keyRoutes = require("./api/routes/keys");
const sourceRoutes = require("./api/routes/sources");
const factRoutes = require("./api/routes/facts");
const moderatorRoutes = require("./api/routes/moderators");
const reportRoutes = require("./api/routes/reports");
const nnModelRoutes = require("./api/routes/nnModels");
const trainingRoutes = require("./api/routes/training");
const path = require("path");
const root = require("../Util/path");
require("dotenv").config({ path: path.join(root, ".env") });
const production = process.env.NODE_ENV == "production" ? true : false;

if (production) {
  mongoose.connect(
    "mongodb+srv://FakeNewsAdmin:murrIq-xytbud-2wubjo@fake-news-detector-vastj.mongodb.net/fake_news_detector?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
} else {
  mongoose.connect(
    "mongodb+srv://FakeNewsAdmin:murrIq-xytbud-2wubjo@fake-news-detector-vastj.mongodb.net/fnd_test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//prevent CORS errors
app.use((res, req, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Routes which should handle requests
app.use("/keys", keyRoutes);
app.use("/sources", sourceRoutes);
app.use("/facts", factRoutes);
app.use("/Users", moderatorRoutes);
app.use("/reports", reportRoutes);
app.use("/nnModels", nnModelRoutes);
app.use("/training", trainingRoutes);

//Requests that passed the routes above are not supported and therefore seen as errors.
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
//handles all other errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
