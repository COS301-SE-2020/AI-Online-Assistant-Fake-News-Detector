const express = require("express");
const server = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const port = 3000;
var cors = require("cors");
// Root path of server
const root = require("./Util/path");

// Routes
const sourceRoutes = require("./api/routes/sources");
const factRoutes = require("./api/routes/facts");
const APIRoutes = require("./api/routes/api");

mongoose.connect(
  // 'mongodb+srv://FakeNewsAdmin:' + process.env.MONGO_ATLAS_PW + '@fake-news-detector-vastj.mongodb.net/fake_news_detector?retryWrites=true&w=majority',
  "mongodb+srv://FakeNewsAdmin:murrIq-xytbud-2wubjo@fake-news-detector-vastj.mongodb.net/fake_news_detector?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

server.use(morgan("dev"));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//Routes which should handle requests
server.use("/sources", sourceRoutes);
server.use("/facts", factRoutes);
server.use("/API", APIRoutes);

//Static files like css or js frontend.
server.use(express.static(path.join(root, "Content")));
//prevent CORS errors
server.use(cors());

server.get("/", (req, res, next) => {
  res.status(200).sendFile(path.join(root, "Views", "index.html"));
});

server.use((req, res, next) => {
  res.status(404).sendFile(path.join(root, "Views", "404.html"));
});

let listener = server.listen(port, () => {
  console.log("Server listening on port " + listener.address().port);
});
